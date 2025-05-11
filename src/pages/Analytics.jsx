import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { FadeLoader } from 'react-spinners';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

const Analytics = () => {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch('http://localhost:8081/api/v1/order/all', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Ошибка при загрузке данных');
                }
                const data = await response.json();
                setOrders(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <FadeLoader color="#36d7b7" height={16} radius={6} width={5} />
            </div>
        );
    }

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    const monthlySales = {};
    const monthlyOrders = {};  // Для подсчета количества заказов

    orders.forEach(order => {
        const [year, month] = order.createdAt.split('.');
        const key = `${year}-${month}`;

        if (!monthlySales[key]) {
            monthlySales[key] = { total: 0, count: 0 };
        }

        if (!monthlyOrders[key]) {
            monthlyOrders[key] = 0;
        }

        monthlySales[key].total += order.totalPrice;
        monthlySales[key].count += 1;
        monthlyOrders[key] += 1;  // Увеличиваем количество заказов для этого месяца
    });

    const labels = Object.keys(monthlySales).sort();
    const totalSales = labels.map(label => monthlySales[label].total.toFixed(2));
    const averageChecks = labels.map(label => (monthlySales[label].total / monthlySales[label].count).toFixed(2));
    const orderCounts = labels.map(label => monthlyOrders[label]);

    const salesData = {
        labels,
        datasets: [
            {
                type: 'bar',
                label: 'Продажи (BYN)',
                data: totalSales,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
            },
            {
                type: 'line',
                label: 'Средний чек (₽)',
                data: averageChecks,
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
                fill: false,
                yAxisID: 'y1',
            }
        ]
    };

    const ordersData = {
        labels,
        datasets: [
            {
                type: 'bar',
                label: 'Количество заказов',
                data: orderCounts,
                backgroundColor: 'rgba(255, 159, 64, 0.6)',
            }
        ]
    };

    const options = {
        responsive: true,
        scales: {
            y: {
                type: 'linear',
                position: 'left',
                title: {
                    display: true,
                    text: 'Продажи (BYN)',
                }
            },
            y1: {
                type: 'linear',
                position: 'right',
                title: {
                    display: true,
                    text: 'Средний чек (BYN)',
                },
                grid: {
                    drawOnChartArea: false,
                },
            },
        },
    };

    return (
        <div>
            <div style={{ width: '60%', height: '400px', margin: '0 0', marginTop: '1rem', marginLeft: '1rem' }}>
                <Bar data={salesData} options={options} width={null} height={null} />
            </div>
            <div style={{ width: '60%', height: '400px', margin: '2rem 0', marginLeft: '2rem' }}>
                <Bar data={ordersData} options={{ responsive: true }} width={null} height={null} />
            </div>
        </div>
    );
};

export { Analytics };

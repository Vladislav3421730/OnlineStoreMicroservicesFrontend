import { useState, useEffect } from 'react';
import { getOrders, getOrdersByEmail } from '../apiMarket';
import { FadeLoader } from "react-spinners";
import { Link } from 'react-router-dom';
import { CustomPagination } from "../components/Pagination";
import { useAuth } from '../hook/useAuth';

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [email, setEmail] = useState('');
    const [searchEmail, setSearchEmail] = useState('');
    const {isAuthorized} = useAuth()

    useEffect(() => {
        if (searchEmail) {
            getOrdersByEmail(searchEmail, currentPage, setOrders, setTotalPages, setLoading);
        } else {
            getOrders(setOrders, setTotalPages, setLoading, currentPage);
        }
    }, [currentPage, searchEmail]);

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleSearch = () => {
        setSearchEmail(email);
        setCurrentPage(0);
    };

    return (
        <div className="container mt-4">
            <div className="d-flex mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Введите email пользователя"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button className="btn btn-primary ms-2" onClick={handleSearch}>
                    Поиск
                </button>
            </div>

            {(loading || !isAuthorized) ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
                    <FadeLoader height={16} radius={6} width={5} />
                </div>
            ) : orders.length === 0 ? (
                <p className="text-center">Заказы не найдены</p>
            ) : (
                <>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">№</th>
                                <th scope="col">ID</th>
                                <th scope="col">email</th>
                                <th scope="col">Сделан</th>
                                <th scope="col">Статус</th>
                                <th scope="col">Информация</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order, index) => (
                                <tr key={order.id}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{order.id}</td>
                                    <td>{order.email}</td>
                                    <td>{order.createdAt}</td>
                                    <td>{order.status}</td>
                                    <td>
                                        <Link to={`/orders/${order.id}`} className="btn btn-primary">Подробнее</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <CustomPagination handlePageChange={handlePageChange} currentPage={currentPage} totalPages={totalPages} />
                </>
            )}
        </div>
    );
};

export { OrdersPage };

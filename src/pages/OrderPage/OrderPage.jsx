import { api } from '../../api';
import { Link, useLoaderData } from 'react-router-dom';
import { useState } from 'react';
import './OrderPage.css';
import { CustomModal } from '../../components/CustomModal';

export const orderLoader = async ({ params }) => {
    const { id } = params;
    try {
        const response = await api.get(`/order/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        })
        console.log(response.data);
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Товар не найден';
        const errorStatus = error.response?.status || 500;

        throw new Response(
            JSON.stringify({ message: errorMessage }),
            {
                status: errorStatus,
                headers: { "Content-Type": "application/json" }
            }
        );
    }
};

const OrderPage = () => {
    const order = useLoaderData();
    const [open, setOpen] = useState(false);
    const [error, setError] = useState('');

    const changeStatus = async (e) => {
        e.preventDefault();
        order.status = e.target.value;
        setOpen(false);
        try {
            await api.put(`/order`, order, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            })
        } catch (error) {
            setError(error.response.data.status);
            console.error("Error while editing order", error);
        }
    }

    return (
        <div className="container">
            {error && <p style={{ color: 'red', marginTop: "10px" }}>{error}</p>}
            <div className="d-flex mt-4">
                <Link to="/orders" className='btn btn-primary'>Все заказы</Link>
                <button className='btn btn-success mx-4' onClick={() => setOpen(true)}>Сменить статус</button>
                <CustomModal open={open} onClose={() => setOpen(false)}>
                    <select className="form-select" onChange={changeStatus} name="status" defaultValue={order.status}>
                        <option disabled>Выберите статус</option>
                        {["принят", "в обработке", "в пути", "доставлен"].map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>

                </CustomModal>
            </div>
            <br></br>
            <strong>Заказ #{order.id}</strong><br></br>
            <strong>email: {order.email}</strong><br></br>
            <strong>Статус заказа: <p className={order.status == 'доставлен' ? 'delivered mx-2' : 'status mx-2'}
            > {order.status} </p> </strong><br></br>
            <strong>Сумма заказа: {order.totalPrice}</strong><br></br>
            <strong>Адресс закакза: {order.address.region}, {order.address.town},
                {order.address.exactAddress}, {order.address.postalCode}</strong><br></br>
            <hr></hr>
            <div className="row">
                {order.orderItems.map((orderItem) => (
                    <div key={orderItem.id} className="col-lg-3 col-md-6">
                        <div className="card mt-2 mb-2" style={{ width: '17.5rem', height: '24rem' }}>
                            <Link to={`/products/${orderItem.product.id}`}>
                                {orderItem.product.imageList.length === 0 ? (
                                    <img
                                        src="https://brilliant24.ru/files/cat/template_01.png"
                                        alt="Нет изображения"
                                        className="card-img-top"
                                    />
                                ) : (
                                    <img
                                        src={`http://localhost:8082/upload/${orderItem.product.imageList[0].filePath}`}
                                        alt={orderItem.product.title}
                                        className="card-img-top"
                                    />
                                )}
                            </Link>
                            <div className="card-body">
                                <strong>{orderItem.product.coast.toLocaleString()} ₽</strong><br />
                                {orderItem.product.title}<br />
                                {orderItem.product.category}<br />
                                <span>Количество: {orderItem.amount}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export { OrderPage };

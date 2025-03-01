import { Link } from "react-router-dom";
import { api } from "../../apiMarket";
import { useState } from "react";
import { API_IMAGE_BASE_URL, NO_PHOTO_URL } from "../../config";
import "./CartInBusket.css";

const CartInBusket = ({ cart, index, updateCart }) => {
    const [amount, setAmount] = useState(cart.amount);

    const handleIncrement = async (index) => {
        try {
            const response = await api.put(`cart/increment/${index}`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            });
            setAmount(amount + 1);
            updateCart({ ...cart, amount: amount + 1 });
        } catch (error) {
            console.error(error.response.data);
        }
    };

    const handleDelete = async (index) => {
        try {
            const response = await api.delete(`cart/delete/${index}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            });
            updateCart({ ...cart, amount: 0 });
        } catch (error) {
            console.error(error.response.data);
        }
    };

    const handleDecrement = async (index) => {
        try {
            const response = await api.put(`cart/decrement/${index}`,{}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            });
            if (amount === 1) {
                updateCart({ ...cart, amount: 0 });
            } else {
                setAmount(amount - 1);
                updateCart({ ...cart, amount: amount - 1 });
            }
        }
        catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="col-lg-3 col-md-6">
            <div className="card mt-2 mb-2" style={{ width: "17.5rem", height: "27.5rem" }}>
                <Link to={`/products/${cart.product.id}`} className="card-link">
                    {cart.product.imageList.length === 0 ? (
                        <img
                            src={NO_PHOTO_URL}
                            className="card-img-top"
                            alt="default"
                        />
                    ) : (
                        <img
                            src={`${API_IMAGE_BASE_URL}/${cart.product.imageList[0].filePath}`}
                            className="card-img-top"
                            style={{ width: "17.5rem", height: "16rem" }}
                            alt={cart.product.title}
                        />
                    )}
                </Link>
                <div className="card-body">
                    <span>{cart.product.title}</span><br />
                    <span>{cart.product.coast}</span><br />
                    <div className="d-flex justify-content-start align-items-center">
                        <span>Количество: </span>
                        <button className="minus-button" onClick={() => handleDecrement(index)}>-</button>
                        {amount} <br />
                        <button className="plus-button" onClick={() => handleIncrement(index)} 
                        disabled={cart.product.amount === 0 || cart.product.amount===amount}>+</button>
                    </div>
                    {cart.product.amount === 0 ? (
                        <span>Нет в наличии</span>
                    ) : (
                        <span>Осталось в наличии: {cart.product.amount}</span>
                    )}
                    <br />
                    {amount === 0 ? (
                        <button className="btn btn-danger mt-2" disabled>Удалено из корзины</button>
                    ) : (
                        <button className="btn btn-danger mt-2" onClick={() => handleDelete(index)}>Удалить из корзины</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export { CartInBusket };

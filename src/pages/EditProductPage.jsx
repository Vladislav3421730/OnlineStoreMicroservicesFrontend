import { useLoaderData } from "react-router-dom";
import { useState } from "react";
import "../pages/AddProductPage/AddProductPage.css";
import "../components/CartInBusket/CartInBusket.css";
import { api } from "../apiMarket";

const EditProductPage = () => {
    const product = useLoaderData();
    const [errors, setErrors] = useState({}); 
    const [productInfo, setProductInfo] = useState({
        id: product.id,
        title: product.title,
        category: product.category,
        description: product.description,
        amount: product.amount,
        coast: product.coast
    });

    const handleProductInfoChange = (e) => {
        const { name, value } = e.target;
        setProductInfo((prevProductInfo) => ({
            ...prevProductInfo,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.put(`products`, productInfo, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                }
            });
            console.log(response.data);
            window.location.href = "/products";
        } catch (error) {
            const errorData = error.response?.data || { general: "Ошибка при обновлении" };
            setErrors(errorData);
            console.error(errorData);
        }
    };

    return (
        <div className="edit-product">
            {Object.keys(errors).length > 0 && (
                <div style={{ color: "red" }}>
                    {Object.entries(errors).map(([field, message]) => (
                        <p key={field}>{message}</p>
                    ))}
                </div>
            )}

            <form className="form-product" onSubmit={handleSubmit}>
                <h2>Редактировать продукт</h2>

                <label className="form-label">Название продукта</label>
                <input
                    className="form-control"
                    type="text"
                    name="title"
                    onChange={handleProductInfoChange}
                    value={productInfo.title}
                    required
                />
                {errors.title && <p style={{ color: "red" }}>{errors.title}</p>}

                <label className="form-label">Категория</label>
                <input
                    className="form-control"
                    type="text"
                    name="category"
                    onChange={handleProductInfoChange}
                    value={productInfo.category}
                    required
                />
                {errors.category && <p style={{ color: "red" }}>{errors.category}</p>}

                <label className="form-label">Описание</label>
                <textarea
                    className="form-control"
                    name="description"
                    onChange={handleProductInfoChange}
                    value={productInfo.description}
                    required
                />
                {errors.description && <p style={{ color: "red" }}>{errors.description}</p>}

                <label className="form-label">Количество</label>
                <input
                    className="form-control"
                    type="number"
                    name="amount"
                    onChange={handleProductInfoChange}
                    value={productInfo.amount}
                    min="1"
                    required
                />
                {errors.amount && <p style={{ color: "red" }}>{errors.amount}</p>}

                <label className="form-label">Цена</label>
                <input
                    className="form-control"
                    type="number"
                    name="coast"
                    onChange={handleProductInfoChange}
                    value={productInfo.coast}
                    min="0.01"
                    step="0.01"
                    required
                />
                {errors.coast && <p style={{ color: "red" }}>{errors.coast}</p>}

                <div className="d-flex mt-2 mb-2">
                    <button type="submit" className="btn btn-primary">Сохранить</button>
                    <button type="button" className="btn btn-danger mx-3" onClick={() => window.location.href = '/products'}>Отмена</button>
                </div>
            </form>
        </div>
    );
};

export { EditProductPage };

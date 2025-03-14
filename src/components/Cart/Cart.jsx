import { Link } from "react-router-dom";
import { useState } from "react";
import { API_IMAGE_BASE_URL, NO_PHOTO_URL } from "../../config";
import { api } from "../../apiMarket";

import "./Cart.css";

const Cart = ({ product }) => {

  const [added, setAdded] = useState('');
  const [error, setError] = useState('')

  const handleAdd = async (id) => {
    try {
      const response = await api.post(`cart/add/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      setAdded("Добавлено в корзину");
      setTimeout(() => setAdded(false), 1300);
    } catch (error) {
      if (!error.response?.status === 401) {
        setError(error.response?.data?.message || "Ошибка");
        setTimeout(() => setError(false), 3000);
      }
      console.error("Error: ", error.response?.data);
    }
  }

  return (
    <div className="col-lg-3 col-md-6">
      <div className="card mt-2 mb-2" style={{ width: "17.5rem", height: "26.5rem" }}>
        <Link to={`/products/${product.id}`} className="card-link">
          {product.imageList.length === 0 ? (
            <img
              src={NO_PHOTO_URL}
              className="card-img-top"
              alt="default"
            />
          ) : (
            <img
              src={`${API_IMAGE_BASE_URL}/${product.imageList[0].filePath}`}
              style={{ width: "17.5rem", height: "16rem" }}
              className="card-img-top"
              alt={product.title}
            />
          )
          }
        </Link>
        <div className="card-body">
          <strong>{product.coast}</strong>
          <br />
          {product.title}
          <br />
          {product.category}
          <br />
          {product.amount === 0 ? (
            <span>Нет в наличии</span>
          ) : (
            <span>Осталось в наличии: {product.amount}</span>
          )}
          <br />
          <button type="submit" onClick={() => { handleAdd(product.id) }}
            className="btn btn-primary w-100 mt-1 btn-block"
            disabled={product.amount === 0}>
            Добавить в корзину
          </button>
          {added && <div className="added-message">{added}</div>}
          {error && <div className="error-message">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export { Cart };

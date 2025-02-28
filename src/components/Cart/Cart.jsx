import { Link } from "react-router-dom";
import { addProductTocart } from "../../apiMarket";
import { useState } from "react";
import { API_IMAGE_BASE_URL, NO_PHOTO_URL } from "../../config";
import "./Cart.css";

const Cart = ({ product }) => {

  const [added, setAdded] = useState(false);

  const handleAdd = (id) => {
    addProductTocart(id);
    setAdded(true);
    setTimeout(() => setAdded(false), 1300);
  };

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
            disabled={product.amount === 0}
          >
            Добавить в корзину
          </button>
          {added && <div className="added-message">Добавлено в корзину</div>}
        </div>
      </div>
    </div>
  );
};

export { Cart };

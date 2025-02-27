import { Link } from "react-router-dom";
import "./Card.css";

const Card = ({ product }) => {
  return (
    <div className="col-lg-3 col-md-6">

      <div className="card mt-2 mb-2" style={{ width: "17.5rem", height: "26.5rem" }}>
        <Link to={`/products/${product.id}`} className="card-link">
          {product.imageList.length === 0 ? (
            <img
              src="https://brilliant24.ru/files/cat/template_01.png"
              className="card-img-top"
              alt="default"
            />
          ) : (
            <img
              src={`http://localhost:8082/upload/${product.imageList[0].filePath}`}
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
          <form action="/user/cart/add" method="POST">
            <input type="hidden" name="id" value={product.id} />
            <button type="submit" className="btn btn-primary w-100 mt-1 btn-block">
              Добавить в корзину
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export { Card };

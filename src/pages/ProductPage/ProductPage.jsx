import React from "react";
import { useLoaderData } from "react-router-dom";
import { api } from "../../apiMarket";
import "./ProductPage.css";
import { API_IMAGE_BASE_URL } from "../../config";

export const productLoader = async ({ params }) => {
  const { id } = params;
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Товар не найден";
    const errorStatus = error.response?.status || 500;

    throw new Response(JSON.stringify({ message: errorMessage }), {
      status: errorStatus,
      headers: { "Content-Type": "application/json" },
    });
  }
};

const ProductPage = () => {
  const product = useLoaderData();

  const handleAdd = async (id) => {
    try {
      const response = await api.post(`cart/add/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
    } catch (error) {
      console.error("Error: ", error.response?.data);

    }
  };

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        <div className="col-lg-1 col-md-0"></div>
        <div className="col-lg-10 col-md-12">
          {product.imageList && product.imageList.length > 0 ? (
            <div
              id="carouselExampleIndicators"
              className="carousel slide"
              data-bs-ride="carousel"
            >
              <div className="carousel-indicators">
                {product.imageList.map((image, index) => (
                  <button
                    key={image.id}
                    type="button"
                    data-bs-target="#carouselExampleIndicators"
                    data-bs-slide-to={index}
                    className={index === 0 ? "active" : ""}
                    aria-current={index === 0 ? "true" : undefined}
                    aria-label={`Слайд ${index + 1}`}
                  ></button>
                ))}
              </div>

              <div className="carousel-inner">
                {product.imageList.map((image, index) => (
                  <div
                    key={image.id}
                    className={`carousel-item ${index === 0 ? "active" : ""}`}
                  >
                    <img
                      className="d-block w-100"
                      src={`${API_IMAGE_BASE_URL}/${image.filePath}`}
                      alt={`Изображение товара ${index + 1}`}
                    />
                  </div>
                ))}
              </div>

              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide="prev"
              >
                <span
                  className="carousel-control-prev-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Предыдущее</span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide="next"
              >
                <span
                  className="carousel-control-next-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Следующее</span>
              </button>
            </div>
          ) : (
            <p>Изображения товара отсутствуют</p>
          )}
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h4>{product.coast} ₽</h4>
              <h5>{product.title}</h5>
              <p className="card-text">Категория: {product.category}</p>
              <p className="text-justify">{product.description}</p>
              <p className="card-text">
                {product.amount === 0
                  ? "Товар отсутствует на складе"
                  : `Осталось на складе: ${product.amount}`}
              </p>
            </div>
            <button type="submit" onClick={() => { handleAdd(product.id) }} className="btn btn-primary mt-2 mb-2"
              disabled={product.amount === 0}>
              Добавить в корзину
            </button>
          </div>
        </div>
        <div className="col-lg-1 col-md-0"></div>
      </div>
    </div>
  );
};

export { ProductPage };

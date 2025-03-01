import { useLoaderData } from "react-router-dom";
import { useState } from "react";
import "../pages/AddProductPage/AddProductPage.css";
import "../components/CartInBusket/CartInBusket.css";
import { API_IMAGE_BASE_URL, NO_PHOTO_URL } from "../config";

const MAX_FILE_SIZE_MB = 2;

const EditProductPage = () => {
    const product = useLoaderData();
    const [error, setError] = useState("");
    const [images, setImages] = useState(product.imageList);
    const [productInfo, setProductInfo] = useState({
        title: product.title,
        category: product.category,
        description: product.description,
        amount: product.amount,
        coast: product.coast,
    });

    const handleProductInfoChange = (e) => {
        const { name, value } = e.target;
        setProductInfo((prevProductInfo) => ({
            ...prevProductInfo,
            [name]: value,
        }));
    };

    const handleDelete = (id) => {
        setImages(images.filter(image => image.id !== id));
    };

    const handleFileChange = (e, index) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
            setError(`Файл "${file.name}" превышает ${MAX_FILE_SIZE_MB}MB`);
            return;
        }
        setError("");
        const newImages = [...images];
        newImages[index] = { ...newImages[index], file, preview: URL.createObjectURL(file) };
        setImages(newImages);
    };

    const addNewImage = () => {
        setImages([...images, { id: Date.now(), file: null, preview: NO_PHOTO_URL }]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitting product:", { ...product, images });
    };

    return (
        <div className="edit-product">
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="d-flex">
                    <div className="form-product" style={{ width: "700px", maxHeight: "500px", overflowY: "auto" }}>
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

                        <label className="form-label">Категория</label>
                        <input
                            className="form-control"
                            type="text"
                            name="category"
                            onChange={handleProductInfoChange}
                            value={productInfo.category}
                            required
                        />

                        <label className="form-label">Описание</label>
                        <textarea
                            className="form-control"
                            name="description"
                            onChange={handleProductInfoChange}
                            value={productInfo.description}
                            required
                        />

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
                    </div>

                    <div className="container-fluid mt-3">
                        <h3>Изображения</h3>
                        <div className="row">
                            {images.map((image, index) => (
                                <div key={image.id} className="col-lg-4 col-md-6 col-sm-6">
                                    <div className="card mt-2 mb-2" style={{ width: "15.5rem", height: "20.5rem" }}>
                                        <img
                                            src={image.preview || `${API_IMAGE_BASE_URL}/${image.filePath}`}
                                            style={{ width: "15.5rem", height: "13rem" }}
                                            className="card-img-top"
                                            alt="product"
                                        />
                                        <input
                                            type="file"
                                            accept="image/jpeg, image/png"
                                            style={{ display: "none" }}
                                            id={`upload-${image.id}`}
                                            onChange={(e) => handleFileChange(e, index)}
                                        />
                                        <div className="card-body">
                                            <div className="d-flex justify-content-center mt-2">
                                                <button
                                                    className="btn btn-success mx-3"
                                                    onClick={() => document.getElementById(`upload-${image.id}`).click()}
                                                    type="button"
                                                >
                                                    Заменить
                                                </button>
                                                <button
                                                    className="btn btn-danger mx-3"
                                                    onClick={() => handleDelete(image.id)}
                                                    type="button"
                                                >
                                                    Удалить
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button type="button" className="btn btn-primary mt-3" onClick={addNewImage}>Добавить изображение</button>
                    </div>
                </div>

                <div className="d-flex mt-2 mb-2 mx-4">
                    <button type="submit" className="btn btn-primary">Сохранить</button>
                    <button type="button" className="btn btn-danger mx-3" onClick={() => window.location.href = '/products'}>Отмена</button>
                </div>
            </form>
        </div>
    );
};

export { EditProductPage };

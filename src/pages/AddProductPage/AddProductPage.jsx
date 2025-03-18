import { useState } from "react";
import { API_IMAGE_BASE_URL, NO_PHOTO_URL } from "../../config";
import { api } from "../../apiMarket";
import './AddProductPage.css'

const MAX_FILE_SIZE_MB = 2;

const AddProductPage = () => {
    const [error, setError] = useState("");
    const [images, setImages] = useState([]);
    const [product, setProduct] = useState({
        title: "",
        category: "",
        description: "",
        amount: "",
        coast: "",
    });

    const handleproductChange = (e) => {
        const { name, value } = e.target;
        setProduct((prevproduct) => ({
            ...prevproduct,
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

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const formData = new FormData();
    
        const productData = {
            title: e.target.title.value,
            category: e.target.category.value,
            description: e.target.description.value,
            amount: e.target.amount.value,
            coast: e.target.coast.value,
        };

        formData.append("product", new Blob([JSON.stringify(productData)], { type: "application/json" }));
    
        images.forEach((image) => {
            const file = document.getElementById(`upload-${image.id}`).files[0];
            if (file) {
                formData.append("file", file);
            }
        });
    
        try {
            const response = await api.post("products", formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    Accept: "application/json", 
                },
            });
            console.log("Продукт успешно добавлен:", response.data);
            window.location.href = "/products"
        } catch (error) {
            console.error("Ошибка при отправке:", error);
        }
    };
    

    return (
        <>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="d-flex">
                    <div className="form-product" style={{ width: "700px", maxHeight: "500px", overflowY: "auto" }}>
                        <h2>Добавить продукт</h2>

                        <label className="form-label">Название продукта</label>
                        <input
                            className="form-control"
                            type="text"
                            name="title"
                            onChange={handleproductChange}
                            value={product.title}
                            required
                            minLength={3}
                        />

                        <label className="form-label">Категория</label>
                        <input
                            className="form-control"
                            type="text"
                            name="category"
                            onChange={handleproductChange}
                            value={product.category}
                            required
                            minLength={3}
                        />

                        <label className="form-label">Описание</label>
                        <textarea
                            className="form-control"
                            name="description"
                            onChange={handleproductChange}
                            value={product.description}
                            required
                            minLength={10}
                        />

                        <label className="form-label">Количество</label>
                        <input
                            className="form-control"
                            type="number"
                            name="amount"
                            onChange={handleproductChange}
                            value={product.amount}
                            min="1"
                            required
                        />

                        <label className="form-label">Цена</label>
                        <input
                            className="form-control"
                            type="number"
                            name="coast"
                            onChange={handleproductChange}
                            value={product.coast}
                            min="0.01"
                            step="0.01"
                            required
                        />
                    </div>

                    <div className="container-fluid mt-3">
                        <h3>Изображения</h3>
                        <div className="row">
                            {images.map((image, index) => (
                                <div key={image.id} className="col-lg-3 col-md-6 col-sm-6">
                                    <div className="card mt-2 mb-2" style={{ width: "12.5rem", height: "18.5rem" }}>
                                        <img
                                            src={image.preview || `${API_IMAGE_BASE_URL}/${image.filePath}`}
                                            style={{ width: "12.5rem", height: "13rem" }}
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
                                                    className="btn btn-success mx-1"
                                                    onClick={() => document.getElementById(`upload-${image.id}`).click()}
                                                    type="button"
                                                >
                                                    Заменить
                                                </button>
                                                <button
                                                    className="btn btn-danger"
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
        </>
    );
};

export { AddProductPage };

import { useEffect, useState } from "react";
import { getProducts } from "../apiMarket";
import { FadeLoader } from "react-spinners";
import { CustomPagination } from "../components/Pagination";
import { CustomModal } from "../components/CustomModal";
import { Filters } from "../components/Filters";
import { Link } from "react-router-dom";
import { api } from "../apiMarket";
import { useAuth } from "../hook/useAuth";

const Products = () => {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState('')
    const [openFilters, setOpenFilters] = useState(false);
    const [openDeleting, setOpenDeleting] = useState(false);
    const [deleteProductId, setDeleteProductId] = useState(null);
    const { isAuthorized } = useAuth()
    const [filters, setFilters] = useState({
        sort: "",
        title: "",
        category: "",
        minPrice: "",
        maxPrice: "",
    });

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    useEffect(() => {
        getProducts(setProducts, setTotalPages, setLoading, currentPage, filters);
    }, [currentPage]);

    useEffect(() => {
        setError('');
    }, [currentPage]);

    const applyFilters = () => {
        getProducts(setProducts, setTotalPages, setLoading, currentPage, filters);
        setOpenFilters(false);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleOnClickFilter = () => {
        setOpenFilters(true);
    };

    const handleDeleteClick = (id) => {
        setDeleteProductId(id);
        setOpenDeleting(true);
    }

    const handleDelete = async (id) => {
        try {
            const response = await api.delete(`products/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            if (response.data) {
                setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
                setError('');
            }
        } catch (error) {
            console.log("Error: ", error.response?.data);
            if (error.response?.data?.code === 403) {
                window.location.href = '/error403';
                return
            }
            setError(error.response?.data?.message || 'Ошибка при удалении Продукта');
        }
        finally {
            setOpenDeleting(false)
        }
    };

    return (
        <>
            <CustomModal open={openDeleting} onClose={() => setOpenDeleting(false)}>
                <button onClick={() => handleDelete(deleteProductId)} className="btn btn-primary">Потвердите действие</button>
            </CustomModal>
            <div className="container-fluid mt-4">
                <section>
                    <div className="row">
                        <div className="col-lg-1 col-md-0"></div>
                        <div className="col-lg-10 col-md-12">
                            <div className="d-flex justify-content-around align-items-center mt-3 mb-3">
                                <div className="input-group w-100 mx-2">
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            name="title"
                                            value={filters.title}
                                            onChange={handleFilterChange}
                                            placeholder="Поиск по названию"
                                            className="form-control"
                                        />
                                        <button
                                            class="btn btn-outline-secondary"
                                            type="button"
                                            id="button-addon2"
                                            onClick={applyFilters}
                                        >
                                            Найти
                                        </button>
                                    </div>
                                    <CustomModal open={openFilters} onClose={() => setOpenFilters(false)}>
                                        <Filters filters={filters} applyFilters={applyFilters} handleFilterChange={handleFilterChange} />
                                    </CustomModal>
                                </div>
                                <button onClick={handleOnClickFilter} className="btn btn-primary">
                                    Фильтры
                                </button>
                            </div>

                            <Link to={"/products/add"} className="btn btn-success mx-2 mb-3">
                                Добавить
                            </Link>
                            {error && <p style={{ color: 'red' }}>{error}</p>}
                            {(loading || !isAuthorized) ? (
                                <div
                                    className="d-flex justify-content-center align-items-center"
                                    style={{ height: "50vh" }}
                                >
                                    <FadeLoader height={16} radius={6} width={5} />
                                </div>
                            ) : products.length === 0 ? (
                                <p className="text-center">Товары не найдены</p>
                            ) : (
                                <>
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th scope="col">№</th>
                                                <th scope="col">ID</th>
                                                <th scope="col">Название</th>
                                                <th scope="col">Цена</th>
                                                <th scope="col">Количество</th>
                                                <th scope="col">Категория</th>
                                                <th scope="col">Редактирование</th>
                                                <th scope="col">Удаление</th>
                                                <th scope="col">Подробнее</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {products.map((product, index) => (
                                                <tr key={product.id}>
                                                    <th scope="row">{index + 1}</th>
                                                    <td>{product.id}</td>
                                                    <td>{product.title}</td>
                                                    <td>{product.price}</td>
                                                    <td>{product.amount}</td>
                                                    <td>{product.category}</td>
                                                    <td>
                                                        <Link to={`/products/edit/${product.id}`} className="btn btn-primary">Редактировать</Link>
                                                    </td>
                                                    <td>
                                                        <button onClick={() => handleDeleteClick(product.id)} className="btn btn-danger">
                                                            Удалить
                                                        </button>
                                                    </td>
                                                    <td>
                                                        <Link to={`/products/${product.id}`} className="btn btn-success">Подробнее</Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <CustomPagination
                                        handlePageChange={handlePageChange}
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                    />
                                </>
                            )}
                        </div>
                        <div className="col-lg-1 col-md-0"></div>
                    </div>
                </section>
            </div>
        </>
    );
}

export { Products }
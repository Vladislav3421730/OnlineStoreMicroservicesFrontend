import { useEffect, useState } from "react";
import { Card } from "../components/Card/Card";
import { getProducts } from "../api";
import { FadeLoader } from "react-spinners";
import { CustomPagination } from "../components/Pagination";

const Homepage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    sort: "",
    title: "",
    category: "",
    minPrice: "",
    maxPrice: ""
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value
    }));
  };

  useEffect(() => {
    getProducts(setProducts, setTotalPages, setLoading, currentPage, filters);
  }, [currentPage]);

  const applyFilters = () => {
    getProducts(setProducts, setTotalPages, setLoading, currentPage, filters);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <>
      <div className="container-fluid mt-4">
        <section>
          <div className="row">
            <div className="col-lg-1 col-md-0"></div>
            <div className="col-lg-10 col-md-12">
              <div className="mb-4">
                <input
                  type="text"
                  name="title"
                  value={filters.title}
                  onChange={handleFilterChange}
                  placeholder="Поиск по названию"
                  className="form-control mb-2"
                />
                <input
                  type="text"
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  placeholder="Категория"
                  className="form-control mb-2"
                />
                <input
                  type="number"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  placeholder="Минимальная цена"
                  className="form-control mb-2"
                />
                <input
                  type="number"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  placeholder="Максимальная цена"
                  className="form-control mb-2"
                />
                <select
                  name="sort"
                  value={filters.sort}
                  onChange={handleFilterChange}
                  className="form-control mb-2"
                >
                  <option value="">Выберите сортировку</option>
                  <option value="cheap">По цене (от дешевых к дорогим)</option>
                  <option value="expensive">По цене (от дорогих к дешевым)</option>
                  <option value="alphabet">По алфавиту</option>
                </select>
                <button onClick={applyFilters} className="btn btn-primary mt-2">
                  Применить фильтры
                </button>
              </div>

              {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
                  <FadeLoader height={16} radius={6} width={5} />
                </div>
              ) : products.length === 0 ? (
                <p className="text-center">Товары не найдены</p>
              ) : (
                <>
                  <div className="row">
                    {products.map((product) => (
                      <div key={product.id} className="col-lg-3 col-md-4 col-sm-6">
                        <Card product={product} />
                      </div>
                    ))}
                  </div>
                  <CustomPagination handlePageChange={handlePageChange} currentPage={currentPage} totalPages={totalPages} />
                </>
              )}
            </div>
            <div className="col-lg-1 col-md-0"></div>
          </div>
        </section>
      </div>
    </>
  );
};

export { Homepage };

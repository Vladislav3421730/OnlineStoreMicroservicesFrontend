import { useEffect, useState } from "react";
import { Cart } from "../components/Cart/Cart";
import { getProducts } from "../apiMarket";
import { FadeLoader } from "react-spinners";
import { CustomPagination } from "../components/Pagination";
import { CustomModal } from "../components/CustomModal";
import { Filters } from "../components/Filters";

const Homepage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState({
    sort: "",
    title: "",
    category: "",
    minPrice: "",
    maxPrice: "",
  });

  const [currency, setCurrency] = useState("BYN");
  const [rates, setRates] = useState({});

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
    const fetchRates = async () => {
      try {
        const response = await fetch(`https://v6.exchangerate-api.com/v6/2c9f6d71a48fd0535f65a37b/latest/BYN`);
        const data = await response.json();
        setRates(data.conversion_rates);
      } catch (error) {
        console.error('Ошибка загрузки курсов валют', error);
      }
    };

    fetchRates();
  }, []);

  const applyFilters = () => {
    getProducts(setProducts, setTotalPages, setLoading, currentPage, filters);
    setOpen(false);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleOnClickFilter = () => {
    setOpen(true);
  };

  return (
    <>
      <div className="container-fluid mt-4">
        <section>
          <div className="row">
            <div className="col-lg-1 col-md-0"></div>
            <div className="col-lg-10 col-md-12">
              <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="form-select w-auto mx-2">
                <option value="BYN">BYN</option>
                <option value="RUB">RUB</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="JPY">JPY</option>
              </select>
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
                  <CustomModal open={open} onClose={() => setOpen(false)}>
                    <Filters
                      filters={filters}
                      applyFilters={applyFilters}
                      handleFilterChange={handleFilterChange}
                    />
                  </CustomModal>
                </div>
                <button
                  onClick={handleOnClickFilter}
                  className="btn btn-primary"
                >
                  Фильтры
                </button>
              </div>
              {loading ? (
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
                  <div className="row">
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className="col-lg-3 col-md-4 col-sm-6"
                      >
                        <Cart product={product} currency={currency} rates={rates} />
                      </div>
                    ))}
                  </div>
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
};

export { Homepage };

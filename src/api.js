import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8081/api",
    timeout: 5000,
});

export async function getProducts(setProducts, setTotalPages, setLoading, currentPage, filters) {
    setLoading(true);
    const { sort, title, category, minPrice, maxPrice } = filters;
    let queryParams = `?page=${currentPage}`;
    if (sort) queryParams += `&sort=${sort}`;
    if (title) queryParams += `&title=${title}`;
    if (category) queryParams += `&category=${category}`;
    if (minPrice) queryParams += `&minPrice=${minPrice}`;
    if (maxPrice) queryParams += `&maxPrice=${maxPrice}`;
    console.log(queryParams);
    api
        .get(`/products${queryParams}`)
        .then((response) => {
            setProducts(response.data.content);
            setTotalPages(response.data.totalPages);
        })
        .catch((error) => console.error("Error fetching data", error))
        .finally(() => setLoading(false));
}

export { api };
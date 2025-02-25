import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8081/api",
    timeout: 10000,
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401) {
            try {
                const refreshToken = localStorage.getItem('refreshToken');
                
                if (!refreshToken) {
                    window.location.href = '/login';
                    return Promise.reject(error); 
                }
                const refreshResponse = await api.post('/auth/refreshToken', { refreshToken });
                localStorage.setItem('accessToken', refreshResponse.data.accessToken);
                localStorage.setItem('refreshToken', refreshResponse.data.refreshToken);

                originalRequest.headers['Authorization'] = `Bearer ${refreshResponse.data.accessToken}`;
                return api(originalRequest);

            } catch (refreshError) {
                if (refreshError.response && refreshError.response.status === 401) {
                    console.log('Refresh token expired', refreshError.response.data);
                    window.location.href = '/login';
                } else if (refreshError.response && refreshError.response.status === 403) {
                    console.log('Forbidden access', refreshError.response.data);
                    window.location.href = '/error403';
                }

                return Promise.reject(refreshError); 
            }
        }
        return Promise.reject(error);
    }
);


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

export async function getOrders(setOrders, setTotalPages, setLoading, currentPage) {
    setLoading(true);
    let queryParams = `?page=${currentPage}`;
    api
        .get(`/order${queryParams}`,{
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        })
        .then((response) => {
            setOrders(response.data.content);
            setTotalPages(response.data.totalPages);
        })
        .catch((error) => console.error("Error fetching data", error))
        .finally(() => setLoading(false));
}

export async function getOrdersByEmail(email, page, setOrders, setTotalPages, setLoading)  {
    setLoading(true);
    let queryParams = `?page=${page}`;
    if (email) queryParams += `&email=${email}`;
    try {
        const response = await api.get(`order/user/email${queryParams}`,{
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        });
        setOrders(response.data.content);
        setTotalPages(response.data.totalPages);
    } catch (error) {
        console.error("Error while find orders by id: ", error);
        setOrders([]);
    }
    setLoading(false);
};

export async function getUsers(page, setUsers, setTotalPages, setLoading)  {
    setLoading(true);
    let queryParams = `?page=${page}`;
    try {
        const response = await api.get(`user/all${queryParams}`,{
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        });
        setUsers(response.data.content);
        setTotalPages(response.data.totalPages);
    } catch (error) {
        console.error("Error while find users", error);
        setUsers([]);
    }
    setLoading(false);
};




export { api };
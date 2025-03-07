import axios from "axios";

const BASE_URL = "http://localhost:8081/api"

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 403) {
            window.location.href = '/error403';
            return;
        }

        console.log("Interceptor caught an error:", error.response?.status, originalRequest?.url);


        if (error.response && error.response.status === 401) {

            if (originalRequest.url === '/auth/refreshToken') {
                localStorage.removeItem('accessToken');
                localStorage.rempveItem('refreshToken');
                window.location.href = '/login';
                return Promise.reject(error);
            }

            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refreshToken');

            if (!refreshToken) {
                window.location.href = '/login';
                return;
            }
            const refreshResponse = await api.post('/auth/refreshToken', { refreshToken });
            localStorage.setItem('accessToken', refreshResponse.data.accessToken);
            localStorage.setItem('refreshToken', refreshResponse.data.refreshToken);

            originalRequest.headers['Authorization'] = `Bearer ${refreshResponse.data.accessToken}`;
            return api(originalRequest);
        }
        return;
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
        .get(`/order${queryParams}`, {
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

export async function getOrdersByEmail(email, page, setOrders, setTotalPages, setLoading) {
    setLoading(true);
    let queryParams = `?page=${page}`;
    if (email) queryParams += `&email=${email}`;
    try {
        const response = await api.get(`/order/user/id${queryParams}`, {
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

export async function getUserByEmail(email, setUsers, setTotalPages, setLoading) {
    setLoading(true);
    try {
        const response = await api.get(`user/email?email=${email}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        });
        setUsers([response.data]);
    } catch (error) {
        console.error("Error while find users", error);
        setUsers([]);
    }
    setTotalPages(1);
    setLoading(false);
};


export async function getUsers(page, setUsers, setTotalPages, setLoading) {
    setLoading(true);
    let queryParams = `?page=${page}`;
    try {
        const response = await api.get(`user/all${queryParams}`, {
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

export async function getUserOrders(id, page, setOrders, setTotalPages, setLoading) {
    setLoading(true);
    try {
        const response = await api.get(`order/user/id/${id}?page=${page}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        });
        setOrders(response.data.content);
        setTotalPages(response.data.totalPages);
    } catch (error) {
        console.error("Error while find users", error);
        setOrders([]);
    }
    setLoading(false);
};

export async function getUserData(setUser, setCarts) {
    try {
        const response = await api.get("user", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });
        setUser(response.data);
        if (setCarts != undefined) {
            setCarts(response.data.carts)
        }
    } catch (error) {
        console.error("Error: ", error);
    }
};

export { api };
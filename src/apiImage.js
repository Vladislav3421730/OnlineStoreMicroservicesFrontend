import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8082/upload",
    timeout: 10000,
});

export async function getImages(setImages, setTotalPages, setLoading, currentPage) {
    setLoading(true);
    api
        .get(`/all?page=${currentPage}&pageSize=23`)
        .then((response) => {
            setImages(response.data.content);
            setTotalPages(response.data.totalPages);
        })
        .catch((error) => console.error("Error fetching data", error))
        .finally(() => setLoading(false));
    setLoading(false)
}

export {api}
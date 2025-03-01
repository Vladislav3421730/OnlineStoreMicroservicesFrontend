import { useEffect, useState } from "react";
import { api, getImages } from "../../apiImage";
import { FadeLoader } from "react-spinners";
import { CustomPagination } from "../../components/Pagination";
import { API_IMAGE_BASE_URL } from "../../config";
import { UploadFile } from "../../components/UploadFile/UploadFile";

const Gallery = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    useEffect(() => {
        getImages(setImages, setTotalPages, setLoading, currentPage)
    }, [currentPage]);

    useEffect(() => {
        setMessage('');
        setError('');
    }, [currentPage]);

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleDownload = async (id) => {
        try {
            const response = await api.get(`download/${id}`, {
                responseType: 'blob'
            });
            const contentDisposition = response.headers.get('content-disposition');

            if (contentDisposition) {
                const filename = contentDisposition.split('filename="')[1].split('"')[0];
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', filename);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                console.error("Content-Disposition header not found.");
            }
        } catch (error) {
            console.error("Ошибка при скачивании файла: ", error.response?.data);
        }
    };

    const handleDelete = (id) => {
        api
            .delete(`/${id}`)
            .then((response) => {
                setImages((prevImages) => prevImages.filter((image) => image.id !== id));
            })
            .catch((error) => {
                console.log(error.response?.data)
            })
    }

    return (
        <>
            {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
                    <FadeLoader height={16} radius={6} width={5} />
                </div>
            ) : (
                <div className="container-fluid mt-4">
                    <div className="row">
                        <div className="col-lg-1 col-md-0"></div>
                        <div className="col-lg-10 col-md-12">
                            <div className="row">
                                {message && <p style={{ color: "green" }}>{message}</p>}
                                {error && <p style={{ color: "red" }}>{error}</p>}
                                <UploadFile setImages={setImages} setError={setError} setMessage={setMessage} />
                                {images.map((image) => (
                                    <div key={image.id} className="col-lg-3 col-md-4 col-sm-6">
                                        <div className="col-lg-3 col-md-6">
                                            <div
                                                className="card mt-2 mb-2"
                                                style={{ width: "17.5rem", height: "23.5rem" }}
                                            >
                                                <img
                                                    src={`${API_IMAGE_BASE_URL}/${image.filename}`}
                                                    style={{ width: "17.5rem", height: "16rem" }}
                                                    className="card-img-top"
                                                    alt={image.filename}
                                                />

                                                <div className="card-body">
                                                    <span>Дата загрузки: {image.uploadAt}</span>
                                                    <div className="d-flex justify-content-center mt-2">
                                                        <button className="btn btn-success mx-3" onClick={() => { handleDownload(image.id) }} >Загрузить</button>
                                                        <button className="btn btn-danger mx-3" onClick={() => { handleDelete(image.id) }} >Удалить</button>                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <CustomPagination
                            handlePageChange={handlePageChange}
                            currentPage={currentPage}
                            totalPages={totalPages}
                        />
                        <div className="col-lg-1 col-md-0"></div>
                    </div>
                </div>
            )}
        </>
    );
};

export { Gallery };

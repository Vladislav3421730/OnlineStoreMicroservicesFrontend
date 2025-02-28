
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { FadeLoader } from "react-spinners";
import { CustomPagination } from "../components/Pagination";
import { getUserOrders } from "../apiMarket";
import { useAuth } from "../hook/useAuth";

const UserOrders = () => {

    const { id } = useParams();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const {isAuthorized} = useAuth()

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
        }
    };

    useEffect(() => {
        getUserOrders(id, currentPage, setOrders, setTotalPages, setLoading)
    }, [currentPage]);

    return (
        <div className="container mt-4">
            {(loading || !isAuthorized) ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
                    <FadeLoader height={16} radius={6} width={5} />
                </div>
            ) : orders.length === 0 ? (
                <p className="text-center">Заказы не найдены</p>
            ) : (
                <>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">№</th>
                                <th scope="col">ID</th>
                                <th scope="col">email</th>
                                <th scope="col">Сделан</th>
                                <th scope="col">Статус</th>
                                <th scope="col">Информация</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order, index) => (
                                <tr key={order.id}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{order.id}</td>
                                    <td>{order.email}</td>
                                    <td>{order.createdAt}</td>
                                    <td>{order.status}</td>
                                    <td>
                                        <Link to={`/orders/${order.id}`} className="btn btn-primary">Подробнее</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <CustomPagination handlePageChange={handlePageChange} currentPage={currentPage} totalPages={totalPages} />
                </>
            )}
        </div>
    );
}

export { UserOrders }
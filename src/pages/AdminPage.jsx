
import { useEffect, useState } from "react"
import { FadeLoader } from "react-spinners";
import { getUsers, api, getUserByEmail } from "../apiMarket";
import { CustomPagination } from "../components/Pagination";
import { Link } from "react-router-dom";
import { CustomModal } from "../components/CustomModal";
import { useAuth } from "../hook/useAuth";

const AdminPage = () => {

    const [open, setOpen] = useState(false)
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [email, setEmail] = useState('');
    const [searchEmail, setSearchEmail] = useState('');
    const [deleteProductId, setDeleteProductId] = useState(null);

    const { isAdmin, isAuthorized, isManager } = useAuth();

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
        }
    };

    useEffect(() => {
        setError('');
    }, [currentPage]);

    const handleSearch = () => {
        setSearchEmail(email);
        setCurrentPage(0);
    };

    const handleBun = async (user) => {
        console.log(user)
        try {
            const response = await api.put(`user/bun`, user, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            })
            if (response.data) {
                setUsers((prevUsers) =>
                    prevUsers.map((u) =>
                        u.id === user.id ? { ...u, bun: !u.bun } : u
                    )
                );
                setError('')
            }
        } catch (error) {
            console.log("Error: ", error.response.data)
            if (error.response?.data?.code === 403) {
                window.location.href = '/error403';
                return
            }
            setError(error.response?.data?.message || 'Ошибка при бане/разбане пользователя')
        }
    }

    const handleDelete = async (id) => {
        try {
            const response = await api.delete(`user/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            if (response.data) {
                setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
                setError('');
            }
        } catch (error) {
            console.log("Error: ", error.response?.data);
            if (error.response?.data?.code === 403) {
                window.location.href = '/error403';
                return
            }
            setError(error.response?.data?.message || 'Ошибка при удалении пользователя');
        }
        finally {
            setOpen(false)
        }
    };

    const handleMadeManager = async (user) => {
        try {
            const isManager = user.roleSet.includes("ROLE_MANAGER");
            const response = await api.put(`user/manager`, user, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            }
            );
            if (response.data) {
                setUsers((prevUsers) =>
                    prevUsers.map((u) =>
                        u.id === user.id
                            ? {
                                ...u,
                                roleSet: isManager
                                    ? u.roleSet.filter(role => role !== "ROLE_MANAGER")
                                    : [...u.roleSet, "ROLE_MANAGER"],
                            }
                            : u
                    )
                );
                setError('');
            }
        } catch (error) {
            console.log("Error: ", error.response?.data);
            if (error.response?.data?.code === 403) {
                window.location.href = '/error403';
                return
            }
            setError(error.response?.data?.message || 'Ошибка при обновлении ролей');
        }
    };

    useEffect(() => {
        if (searchEmail) {
            getUserByEmail(searchEmail, setUsers, setTotalPages, setLoading);
        } else {
            getUsers(currentPage, setUsers, setTotalPages, setLoading);
        }
    }, [currentPage, searchEmail]);

    const handleDeleteClick = (id) => {
        setDeleteProductId(id);
        setOpen(true);
    }



    return (
        <>
            <CustomModal open={open} onClose={() => setOpen(false)}>
                <button onClick={() => handleDelete(deleteProductId)} className="btn btn-primary">Потвердите действие</button>
            </CustomModal>
            <div className="container mt-4">
                <div className="d-flex mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Введите email пользователя"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button className="btn btn-primary ms-2" onClick={handleSearch}>
                        Поиск
                    </button>
                </div>
                {(loading || !isAuthorized) ? (
                    <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
                        <FadeLoader height={16} radius={6} width={5} />
                    </div>
                ) : users.length === 0 ? (
                    <p className="text-center">Пользователи не найдены</p>
                ) : (
                    <>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">№</th>
                                    <th scope="col">ID</th>
                                    <th scope="col">логин</th>
                                    <th scope="col">email</th>
                                    <th scope="col">Телефон</th>
                                    {isAdmin && (
                                        <>
                                            <th scope="col">Бан</th>
                                            <th scope="col">Удалить</th>
                                            <th scope="col">Менеджер</th>

                                        </>
                                    )}
                                    {isManager &&
                                        <th scope="col">Заказы</th>
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, index) => (
                                    <tr key={user.id}>
                                        <td>{index + 1}</td>
                                        <td>{user.id}</td>
                                        <th>{user.username}</th>
                                        <td>{user.email}</td>
                                        <td>{user.phoneNumber}</td>
                                        {isAdmin && (
                                            <>
                                                <td>
                                                    <button onClick={() => handleBun(user)} className={!user.bun ? 'btn btn-danger' : 'btn btn-success'}>
                                                        {!user.bun ? 'Забанить' : 'Разбанить'}</button>
                                                </td>
                                                <td>
                                                    <button onClick={() => handleDeleteClick(user.id)} className="btn btn-danger">Удалить</button>
                                                </td>
                                                <td>
                                                    <button onClick={() => { handleMadeManager(user) }}
                                                        className={!user.roleSet.includes("ROLE_MANAGER") ? 'btn btn-primary' : 'btn btn-success'}>
                                                        {!user.roleSet.includes("ROLE_MANAGER") ? 'Сделать менеджером' : 'Лишить роли'}</button>
                                                </td>
                                            </>
                                        )}
                                        {isManager &&
                                            <td>
                                                <Link to={`/user/orders/${user.id}`} className="btn btn-primary">Заказы</Link>
                                            </td>
                                        }
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <CustomPagination handlePageChange={handlePageChange} currentPage={currentPage} totalPages={totalPages} />
                    </>
                )}
            </div>
        </>
    )
}

export { AdminPage }
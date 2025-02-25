
import { useEffect, useState } from "react"
import { FadeLoader } from "react-spinners";
import { getUsers, api } from "../api";
import { CustomPagination } from "../components/Pagination";
import { Link } from "react-router-dom";
import { CustomModal } from "../components/CustomModal";

const AdminPage = () => {

    const [open,setOpen] = useState(false)
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
        }
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
            setError(error.response?.data?.message || 'Ошибка при удалении пользователя');
        }
    };

    const handleMadeManager = async (user) => {
        try {
            const isManager = user.roleSet.includes("ROLE_MANAGER");
            const response = await api.put(`user/manager`, user,  {
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
            setError(error.response?.data?.message || 'Ошибка при обновлении ролей');
        }
    };
    



    useEffect(() => {
        getUsers(currentPage, setUsers, setTotalPages, setLoading);
    }, [currentPage]);

    return (
        <div className="container mt-4">
            {loading ? (
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
                                <th scope="col">Бан</th>
                                <th scope="col">Удалить</th>
                                <th scope="col">Менеджер</th>
                                <th scope="col">Заказы</th>
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
                                    <td>
                                        <button onClick={() => handleBun(user)} className={!user.bun ? 'btn btn-danger' : 'btn btn-success'}>
                                            {!user.bun ? 'Забанить' : 'Разбанить'}</button>
                                    </td>
                                    <td>
                                    <CustomModal open={open} onClose={() => setOpen(false)}>
                                        <button onClick={()=>handleDelete(user.id)} className="btn btn-primary">Потвердите действие</button>
                                    </CustomModal>
                                    <button onClick={() => setOpen(true)} className="btn btn-danger">Удалить</button>
                                    </td>
                                    <td>
                                    <button onClick={()=>{handleMadeManager(user)}} 
                                    className={!user.roleSet.includes("ROLE_MANAGER") ? 'btn btn-primary' : 'btn btn-success'}>
                                        {!user.roleSet.includes("ROLE_MANAGER") ? 'Сделать менеджером' : 'Лишить роли'}</button>
                                    </td>
                                    <td>
                                        <Link to={`/user/orders/${user.id}`} className="btn btn-primary">Заказы</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <CustomPagination handlePageChange={handlePageChange} currentPage={currentPage} totalPages={totalPages} />
                </>
            )}
        </div>
    )
}

export { AdminPage }
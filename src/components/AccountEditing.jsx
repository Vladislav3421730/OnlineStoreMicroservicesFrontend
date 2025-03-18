import { useState } from "react";
import { api } from "../apiMarket";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const AccountEditing = ({ setOpen, user, logout }) => {
    const [updatedUser, setUpdatedUser] = useState({
        id: user.id,
        email: user.email,
        username: user.username,
        phoneNumber: user.phoneNumber,
    });

    const [fieldErrors, setFieldErrors] = useState({});
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: () =>
            api.put("profile/update", updatedUser, {
                headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
            }),
        onSuccess: (response) => {
            console.log("Профиль успешно обновлен", response.data);
            setFieldErrors({});
            setOpen(false);
            if (user.email !== response.data.email) {
                logout();
            } else {
                queryClient.setQueryData('user', response.data);
            }
        },
        onError: (error) => {
            console.error("Ошибка обновления профиля", error.response?.data || error.message);

            const errorData = error.response?.data;
            if (errorData?.errors) {
                setFieldErrors(errorData.errors);
            } else {
                setFieldErrors({});
            }
        },
    });

    const handleUpdatedUserChange = (e) => {
        const { name, value } = e.target;
        setUpdatedUser((prevUserInfo) => ({
            ...prevUserInfo,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        mutation.mutate();
    };

    return (
        <form onSubmit={handleSubmit}>
            {mutation.isError && !fieldErrors && (
                <p className="text-danger">{mutation.error.response?.data?.message || mutation.error.message}</p>
            )}

            <label htmlFor="email" className="form-label">Email</label>
            <input type="hidden" name="id" value={updatedUser.id} />
            <input
                type="email"
                className={`form-control ${fieldErrors.email ? 'is-invalid' : ''}`}
                name="email"
                id="email"
                placeholder="Введите новый email"
                value={updatedUser.email}
                onChange={handleUpdatedUserChange}
                required
            />
            {fieldErrors.email && <div className="invalid-feedback">{fieldErrors.email}</div>}

            <label htmlFor="username" className="form-label">Имя</label>
            <input
                type="text"
                className={`form-control ${fieldErrors.username ? 'is-invalid' : ''}`}
                name="username"
                id="username"
                placeholder="Введите новое имя пользователя"
                value={updatedUser.username}
                onChange={handleUpdatedUserChange}
                required
            />
            {fieldErrors.username && <div className="invalid-feedback">{fieldErrors.username}</div>}

            <label htmlFor="phoneNumber" className="form-label">Номер телефона</label>
            <input
                type="text"
                className={`form-control ${fieldErrors.phoneNumber ? 'is-invalid' : ''}`}
                name="phoneNumber"
                id="phoneNumber"
                placeholder="Введите новый номер телефона"
                value={updatedUser.phoneNumber}
                pattern="\+375[0-9]{9}"
                onChange={handleUpdatedUserChange}
            />
            {fieldErrors.phoneNumber && <div className="invalid-feedback">{fieldErrors.phoneNumber}</div>}

            <input type="submit" className="btn btn-success mt-3" value="Изменить профиль" />
        </form>
    );
};

export { AccountEditing };

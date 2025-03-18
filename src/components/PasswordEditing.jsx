import { useState } from "react";
import { api } from "../apiMarket";

const PasswordEditing = ({ setOpen, id, logout }) => {
    const [updatedUserPassword, setUpdatedUserPassword] = useState({
        id: id,
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
    });

    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");

    const handleUpdatedUserPasswordChange = (e) => {
        const { name, value } = e.target;
        setUpdatedUserPassword((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validate = () => {
        let tempErrors = {};
        if (!updatedUserPassword.oldPassword) tempErrors.oldPassword = "Введите текущий пароль";
        if (!updatedUserPassword.newPassword) tempErrors.newPassword = "Введите новый пароль";
        if (updatedUserPassword.newPassword.length < 6) tempErrors.newPassword = "Пароль должен быть не менее 6 символов";
        if (updatedUserPassword.newPassword !== updatedUserPassword.confirmNewPassword) tempErrors.confirmNewPassword = "Пароли не совпадают";
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            const response = await api.put(`profile/update/password`, updatedUserPassword, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            setOpen(false)
            console.log("Пароль успешно изменен:", response.data);
            logout();
        } catch (error) {
            if (error.response && error.response.data.errors) {
                setServerError("")
                setErrors(error.response.data.errors)
            }
            else if (error.response && error.response.data.message) {
                setErrors({})
                setServerError(error.response.data.message || "Ошибка при смене пароля");
            } else {
                setServerError("Не удалось изменить пароль. Попробуйте позже.");
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {serverError && <div className="text-danger">{serverError}</div>}

            <label className="form-label">Текущий пароль</label>
            <input
                className={`form-control ${errors.oldPassword ? "is-invalid" : ""}`}
                type="password"
                name="oldPassword"
                onChange={handleUpdatedUserPasswordChange}
                value={updatedUserPassword.oldPassword}
                required
            />
            {errors.oldPassword && <div className="invalid-feedback">{errors.oldPassword}</div>}

            <label className="form-label">Новый пароль</label>
            <input
                className={`form-control ${errors.newPassword ? "is-invalid" : ""}`}
                type="password"
                name="newPassword"
                onChange={handleUpdatedUserPasswordChange}
                value={updatedUserPassword.newPassword}
                required
            />
            {errors.newPassword && <div className="invalid-feedback">{errors.newPassword}</div>}

            <label className="form-label">Подтвердите новый пароль</label>
            <input
                className={`form-control ${errors.confirmNewPassword ? "is-invalid" : ""}`}
                type="password"
                name="confirmNewPassword"
                onChange={handleUpdatedUserPasswordChange}
                value={updatedUserPassword.confirmNewPassword}
                required
            />
            {errors.confirmNewPassword && <div className="invalid-feedback">{errors.confirmNewPassword}</div>}

            <button type="submit" className="btn btn-success mt-3">Изменить пароль</button>
        </form>
    );
};

export { PasswordEditing };

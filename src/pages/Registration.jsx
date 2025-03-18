import { useState, useEffect } from "react";
import { api } from "../apiMarket";

const Registration = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
    });

    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});

    useEffect(() => {
        if (error) {
            console.log("Ошибка регистрации:", error);
        }
    }, [error]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const registerUser = async (e) => {
        e.preventDefault();
    
        if (formData.password !== formData.confirmPassword) {
            setError("Пароли не совпадают!");
            return;
        }
        try {
            const response = await api.post("auth/register", formData);
            if (response.status === 200) {
                window.location.href = "/login"; 
            }
        } catch (err) {
            console.error("Ошибка регистрации:", err.response?.data);
            const errorData = err.response?.data;
            if (errorData?.errors) {
                setFieldErrors(errorData.errors);
            } else {
                setError(errorData?.message || "Произошла ошибка при регистрации");
                setFieldErrors({});
            }
        }
    };
    
    return (
        <div className="container mt-5 mb-5">
            <div className="row justify-content-center">
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title text-center">Регистрация</h5>
                            {error && <p style={{ color: "red" }}>{error}</p>}
                            <form onSubmit={registerUser}>
                                <div className="form-group mb-2">
                                    <label htmlFor="username">Имя пользователя</label>
                                    <input
                                        type="text"
                                        className={`form-control mt-1 ${fieldErrors.username ? 'is-invalid' : ''}`}
                                        name="username"
                                        id="username"
                                        minLength={3}
                                        placeholder="Введите имя пользователя"
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                    />
                                    {fieldErrors.username && <div className="invalid-feedback">{fieldErrors.username}</div>}
                                </div>
                                <div className="form-group mb-2">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        className={`form-control mt-1 ${fieldErrors.email ? 'is-invalid' : ''}`}
                                        name="email"
                                        id="email"
                                        placeholder="Введите email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                    {fieldErrors.email && <div className="invalid-feedback">{fieldErrors.email}</div>}
                                </div>
                                <div className="form-group mb-2">
                                    <label htmlFor="phoneNumber">Телефон</label>
                                    <input
                                        type="text"
                                        className={`form-control mt-1 ${fieldErrors.phoneNumber ? 'is-invalid' : ''}`}
                                        name="phoneNumber"
                                        id="phoneNumber"
                                        placeholder="+375XXXXXXXXX"
                                        pattern="\+375[0-9]{9}"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                    />
                                    {fieldErrors.phoneNumber && <div className="invalid-feedback">{fieldErrors.phoneNumber}</div>}
                                </div>
                                <div className="form-group mb-2">
                                    <label htmlFor="register-password">Пароль</label>
                                    <input
                                        type="password"
                                        className={`form-control mt-1 ${fieldErrors.password ? 'is-invalid' : ''}`}
                                        name="password"
                                        minLength={6}
                                        id="register-password"
                                        placeholder="Введите пароль"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                    {fieldErrors.password && <div className="invalid-feedback">{fieldErrors.password}</div>}
                                </div>
                                <div className="form-group mb-2">
                                    <label htmlFor="confirmPassword">Подтверждение пароля</label>
                                    <input
                                        type="password"
                                        className={`form-control mt-1 ${fieldErrors.confirmPassword ? 'is-invalid' : ''}`}
                                        name="confirmPassword"
                                        id="confirmPassword"
                                        placeholder="Повторите пароль"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                    {fieldErrors.confirmPassword && <div className="invalid-feedback">{fieldErrors.confirmPassword}</div>}
                                </div>
                                <button type="submit" className="btn btn-primary btn-block mt-2">
                                    Зарегистрироваться
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export { Registration };

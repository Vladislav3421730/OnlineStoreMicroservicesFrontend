import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { api } from '../api'; 

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', { email, password });
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            const from = location.state?.from?.pathname || '/';
            navigate(from, { replace: true });
            window.location.reload();
        } catch (err) {
            if(err.response.status === 403) {
                window.location.href = '/error403';
                return;
            }
            setError(err.response.data.message); 
        }
    };

    return (
        <div className="container mt-4 w-100">
            <div className="row justify-content-center">
                <div className="col-md-4">
                    <div className="card" style={{ width: '18rem' }}>
                        <div className="card-header">Вход</div>
                        <div className="card-body">
                            <form onSubmit={handleLogin}>
                                {error && <p style={{ color: 'red' }}>{error}</p>}
                                <div className="mb-3">
                                    <label htmlFor="login" className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="login"
                                        name="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Пароль</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        name="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary">Войти</button>
                            </form>
                        </div>
                    </div>
                    <div id="add-info">
                        <h5 className="mt-4">Нет аккаунта</h5>
                        <Link to="/registration" className="btn btn-primary">Регистрация</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export { LoginPage };

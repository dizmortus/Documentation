import React, { useState } from 'react';
import api from './services/api';
import TokenService from "./services/TokenService";

const LoginForm = ({ onLogin }) => {
    const [identifier, setIdentifier] = useState(''); // Изменено с username на identifier
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (event) => {
        event.preventDefault(); // предотвращает перезагрузку страницы
        api.post('/api/auth/login', { identifier, password }) // Изменено с username на identifier
            .then(response => {
                const { token, user } = response.data;
                if (user && user.accessToken) {
                    TokenService.setUser(user);
                    alert("Вы вошли как " + user.username + "."); // Изменено с identifier на user.username
                    onLogin(user);
                } else {
                    setError("Неверные данные!");
                }
            })
            .catch(error => {
                console.log(error);
                setError("Неверные данные!");
            });
    };

    return (
        <form onSubmit={handleLogin} className="auth-form">
            <h2>Вход</h2>
            {error && <p className="error-message">{error}</p>}
            <div>
                <input
                    type="text"
                    placeholder="Логин или Email" // Изменен placeholder
                    value={identifier}
                    onChange={e => setIdentifier(e.target.value)} // Изменено с setUsername на setIdentifier
                    required
                    className="auth-input"
                />
            </div>
            <div>
                <input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="auth-input"
                />
            </div>
            <button type="submit" className="auth-button">Войти</button>
        </form>
    );
};

export default LoginForm;

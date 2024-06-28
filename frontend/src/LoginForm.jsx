import React, { useState } from 'react';
import api from './services/api';
import TokenService from "./services/TokenService";

const LoginForm = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (event) => {
        event.preventDefault(); // предотвращает перезагрузку страницы
        api.post('/api/auth/login', { username, password })
            .then(response => {
                const { token, user } = response.data;
                if (user && user.accessToken) {
                    TokenService.setUser(user);
                    alert("Вы вошли как " + username + ".");
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
        <form onSubmit={handleLogin}>
            <h2>Вход</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div>
                <input
                    type="text"
                    placeholder="Логин"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                />
            </div>
            <div>
                <input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Войти</button>
        </form>
    );
};

export default LoginForm;

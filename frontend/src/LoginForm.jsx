// LoginForm.jsx
import React, { useState } from 'react';
import axios from 'axios';

const LoginForm = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        axios.post('/api/auth/login', { username, password })
            .then(response => {
                // Успешная обработка ответа от сервера
                console.log(response.data); // Здесь можно обработать данные с сервера
                onLogin(); // Вызываем функцию, переданную из родительского компонента
            })
            .catch(error => {
                // Обработка ошибок
                console.error('Ошибка при отправке запроса:', error);
            });
    };

    return (
        <div className="login-form">
            <input
                type="text"
                placeholder="Логин"
                value={username}
                onChange={e => setUsername(e.target.value)}
            /><br />
            <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={e => setPassword(e.target.value)}
            /><br />
            <button onClick={handleLogin}>Войти</button>
        </div>
    );
};

export default LoginForm;

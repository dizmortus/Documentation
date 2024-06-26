import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';

const LoginForm = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();

    const handleLogin = () => {
        axios.post('/api/auth/login', { username, password })
            .then(response => {
                // Успешная обработка ответа от сервера
                console.log(response.data); // Здесь можно обработать данные с сервера
                dispatch({ type: 'SET_USER', payload: response.data });
                onLogin(response.data); // Передаем данные пользователя
                alert("Вы успешно зашли как " + username);
            })
            .catch(error => {
                // Обработка ошибок
                alert("Неверные данные!");
                console.log("Неверные данные!");
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

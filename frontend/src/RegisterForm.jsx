// Файл: RegisterForm.jsx

import React, { useState } from 'react';
import axios from 'axios';
import api from './services/api'

const RegisterForm = ({ onRegister }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleRegister = (e) => {
        e.preventDefault();
        api.post('/api/auth/register', { username, password })
            .then(response => {
                alert("Регистрация прошла успешно!")
                onRegister(response.data); // обработка успешной регистрации
            })
            .catch(error => {
                setError('Ошибка регистрации. Попробуйте снова.');
            });
    };

    return (
        <form onSubmit={handleRegister}>
            <h2>Регистрация</h2>
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
            <button type="submit">Зарегистрироваться</button>
        </form>
    );
};

export default RegisterForm;

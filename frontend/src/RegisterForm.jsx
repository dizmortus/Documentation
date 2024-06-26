// Файл: RegisterForm.jsx

import React, { useState } from 'react';
import axios from 'axios';

const RegisterForm = ({ onRegister }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleRegister = (e) => {
        e.preventDefault();
        axios.post('/api/register', { username, password })
            .then(response => {
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
                <label>Логин</label>
                <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Пароль</label>
                <input
                    type="password"
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

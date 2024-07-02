import React, { useState } from 'react';
import api from './services/api';

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
        <form onSubmit={handleRegister} className="auth-form">
            <h2>Регистрация</h2>
            {error && <p className="error-message">{error}</p>}
            <div>
                <input
                    type="text"
                    placeholder="Логин"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
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
            <button type="submit" className="auth-button">Зарегистрироваться</button>
        </form>
    );
};

export default RegisterForm;

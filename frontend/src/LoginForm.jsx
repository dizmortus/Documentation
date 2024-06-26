import React, { useState } from 'react';
import axios from 'axios';


const LoginForm = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        axios.post('/api/auth/login', { username, password })
            .then(response => {

                const { token ,user} = response.data;
                localStorage.setItem('jwtToken', token);
                
                onLogin(user);

                alert("Вы успешно зашли как " + username);
            })
            .catch(error => {
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

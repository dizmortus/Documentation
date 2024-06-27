import React, { useState } from 'react';
import axios from 'axios';
import api from './services/api'
import TokenService from "./services/TokenService";


const LoginForm = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        api.post('/api/auth/login', { username, password })
            .then(response => {
                const {token,user} = response.data;
                if(user.accessToken){
                    TokenService.setUser(user);
                }
                
                onLogin(user);

                alert("Вы успешно зашли как " + username);
            })
            .catch(error => {
                console.log(error)
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

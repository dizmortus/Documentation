import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainApp from './MainApp.jsx';
import DynamicPage from './DynamicPage.jsx';
import axios from 'axios';
import TokenService from './services/TokenService';
import { useDispatch, useSelector } from 'react-redux';
import api from "./services/api";

function App() {
    const [isLoading, setIsLoading] = useState(true);
    const user = useSelector(state => state.user.user);
    const dispatch = useDispatch();

    useEffect(() => {
        // Проверка аутентификации при загрузке приложения
        const maxAttempts = 3;
        let attempts = 0;

        const checkAuthentication = async () => {
            try {
                // Проверка аутентификации на сервере
                const response = await api.get('/api/auth/check-auth', {
                    headers: {
                        'x-access-token': `${TokenService.getLocalAccessToken()}`
                    }
                });
                console.log('Authentication complete');
                console.log('Server response:', response.data);
                TokenService.setUser(response.data);
                // Пользователь аутентифицирован, не делаем ничего
            } catch (error) {
                // Обработка ошибки аутентификации
                console.error('Authentication error:', error);
                attempts++;
                if (attempts < maxAttempts) {
                    setTimeout(checkAuthentication, 1000); // Повторная попытка через 1 секунду
                } else {
                    // Очистка данных пользователя и разлогин
                    TokenService.removeUser();
                    dispatch({ type: 'LOGOUT_USER' });
                    console.error('Exceeded max authentication attempts.');
                }
            } finally {
                console.log('User role:', user ? user.role : null);
                setIsLoading(false);
            }
        };

        checkAuthentication(); // Запуск первой попытки при монтировании компонента
    }, [dispatch]);

    if (isLoading) {
        return <div>Authentication...</div>; // Показать загрузку, пока проверяется аутентификация
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainApp />} />
                <Route path="/page/:id" element={user ? <DynamicPage /> : <Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import NewPage from './NewPages.jsx';
import LoginForm from './LoginForm.jsx';

function App() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const pages = useSelector(state => state.pages.pages);
    const pageCount = useSelector(state => state.pages.pageCount);
    const dispatch = useDispatch();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogin = (username, password) => {
        // Здесь можно добавить логику проверки учетных данных (например, запрос на сервер)
        // В данном примере просто примитивная проверка
        if (username === 'user' && password === 'password') {
            setIsLoggedIn(true);
        } else {
            alert('Неверные учетные данные');
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
    };

    useEffect(() => {
        axios.get('/api/pages')
            .then(response => {
                dispatch({ type: 'SET_PAGES', payload: response.data });
            })
            .catch(error => {
                console.error(error);
            });
    }, [dispatch]);

    const addPage = () => {
        if (title && content) {
            const newPage = { title, content };
            axios.post('/api/pages', newPage, {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
                .then(response => {
                    dispatch({ type: 'ADD_PAGE', payload: response.data });
                    setTitle('');
                    setContent('');
                })
                .catch(error => {
                    console.error(error);
                });
        }
    };

    const removePage = (pageId) => {
        axios.delete(`/api/pages/${pageId}`)
            .then(() => {
                dispatch({ type: 'REMOVE_PAGE', payload: pageId });
            })
            .catch(error => {
                console.error(error);
            });
    };

    return (
        <div className="container">
            <header>
                <h1>Техническая документация</h1>
                <p>Количество страниц: {pageCount}</p>
            </header>
            <nav id="pageMenu">
                {pages.map(page => (
                    <NewPage key={page.id} page={page} removePage={removePage} />
                ))}
            </nav>
            <main>
            {!isLoggedIn && (
                    <div className="login-container">
                        <LoginForm onLogin={handleLogin} />
                    </div>
                )}
                {isLoggedIn && (
                <div className="content"><input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Название страницы"
                /><br />
                <textarea
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    rows="10"
                    cols="50"
                    placeholder="Содержимое страницы (HTML)"
                ></textarea><br />

                <button onClick={addPage}>Добавить</button></div>
                )}

            </main>
            <footer>
                {/* Футер сайта */}
            </footer>
        </div>
        
    );
}

export default App;

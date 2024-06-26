import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import axios from 'axios';
import NewPage from './NewPages.jsx';
import LoginForm from './LoginForm.jsx';
import RegisterForm from './RegisterForm.jsx';
import './styles.css';


function App() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const pages = useSelector(state => state.pages.pages);
    const pageCount = useSelector(state => state.pages.pageCount);
    const user = useSelector(state => state.user.user);
    const dispatch = useDispatch();
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [showRegisterForm, setShowRegisterForm] = useState(false);

    const handleLogin = (userData) => {
        dispatch({ type: 'SET_USER', payload: userData });
        setShowLoginForm(false);
    };

    const handleRegister = (userData) => {
        dispatch({ type: 'SET_USER', payload: userData });
        setShowRegisterForm(false);
    };

    const handleLogout = () => {
        dispatch({ type: 'LOGOUT_USER' });
    };

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        axios.get('/api/pages', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            dispatch({ type: 'SET_PAGES', payload: response.data });
        })
        .catch(error => {
            console.error(error);
        });
    }, [dispatch]);
    
    const addPage = () => {
        const token = localStorage.getItem('jwtToken');
        if (title && content) {
            const newPage = { title, content };
            axios.post('/api/pages', newPage, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
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
        const token = localStorage.getItem('jwtToken');
        axios.delete(`/api/pages/${pageId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(() => {
            dispatch({ type: 'REMOVE_PAGE', payload: pageId });
        })
        .catch(error => {
            console.error(error);
        });
    };
    
    const isLoggedIn = !!user;
    const isAdmin = user?.role === 'admin';
    const isUser = user?.role === 'user';

    return (
        <div className="app">
            <header>
                <h1>Техническая документация</h1>
                <p>Количество страниц: {pageCount}</p>
                <div className="auth-buttons">
                    {isLoggedIn ? (
                        <button onClick={handleLogout} className="auth-button">Выйти</button>
                    ) : (
                        <>
                            <button onClick={() => setShowLoginForm(true)} className="auth-button">Войти</button>
                            <button onClick={() => setShowRegisterForm(true)} className="auth-button">Зарегистрироваться</button>
                        </>
                    )}
                </div>
            </header>
            <div className="content">
                <nav id="pageMenu">
                    {pages.map(page => (
                        <NewPage key={page.id} page={page} removePage={isLoggedIn && isAdmin ? removePage : null} />
                    ))}
                </nav>
                <main>
                    {!isLoggedIn && showLoginForm && (
                        <div className="login-container">
                            <LoginForm onLogin={handleLogin} />
                        </div>
                    )}
                    {!isLoggedIn && showRegisterForm && (
                        <div className="register-container">
                            <RegisterForm onRegister={handleRegister} />
                        </div>
                    )}
                    {isLoggedIn && isAdmin && (
                        <div className="page-editor">
                            <input
                                type="text"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder="Название страницы"
                            /><br />
                            <CKEditor
                                editor={ClassicEditor}
                                data={content}
                                onChange={(event, editor) => {
                                    const data = editor.getData();
                                    setContent(data);
                                }}
                            /><br />
                            <button onClick={addPage}>Добавить</button>
                        </div>
                    )}
                    {isLoggedIn && (3 || isUser) && (
                        <div className="comment-section">
                            {/* Курилл добавь комменты сюда */}
                        </div>
                    )}
                </main>
            </div>
            <footer>
                <a>Сделали студенты из БНТУ</a>
            </footer>
        </div>
    );
}

export default App;

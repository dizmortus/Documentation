import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import LoginForm from './LoginForm.jsx';
import RegisterForm from './RegisterForm.jsx';
import TokenService from './services/TokenService.js';
import Comments from './Comments.jsx';
import './styles.css';

function MainApp() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [editingPageId, setEditingPageId] = useState(null);
    const pages = useSelector(state => state.pages.pages);
    const pageCount = useSelector(state => state.pages.pageCount);
    const user = useSelector(state => state.user.user);
    const dispatch = useDispatch();
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [showRegisterForm, setShowRegisterForm] = useState(false);

    const handleLogin = (userData) => {
        TokenService.setUser(userData);
        dispatch({ type: 'SET_USER', payload: userData });
        setShowLoginForm(false);
    };

    const handleRegister = (userData) => {
        TokenService.setUser(userData);
        dispatch({ type: 'SET_USER', payload: userData });
        setShowRegisterForm(false);
    };

    const handleLogout = () => {
        TokenService.removeUser();
        dispatch({ type: 'LOGOUT_USER' });
    };

    useEffect(() => {
        const storedUser = TokenService.getUser();
        if (storedUser) {
            dispatch({ type: 'SET_USER', payload: storedUser });
        }

        const storedPages = JSON.parse(localStorage.getItem('pages')) || [];
        dispatch({ type: 'SET_PAGES', payload: storedPages });
    }, [dispatch]);

    const addPage = () => {
        if (title && content) {
            const newPage = { id: pages.length + 1, title, content };
            dispatch({ type: 'ADD_PAGE', payload: newPage });
            setTitle('');
            setContent('');
            setEditingPageId(null);
        }
    };

    const savePage = () => {
        if (editingPageId !== null && title && content) {
            const updatedPage = { id: editingPageId, title, content };
            dispatch({ type: 'UPDATE_PAGE', payload: updatedPage });
            setTitle('');
            setContent('');
            setEditingPageId(null);
        }
    };

    const editPage = (pageId) => {
        const page = pages.find(p => p.id === pageId);
        setTitle(page.title);
        setContent(page.content);
        setEditingPageId(pageId);
    };

    const removePage = (pageId) => {
        dispatch({ type: 'REMOVE_PAGE', payload: pageId });
    };

    const isLoggedIn = !!user;
    const isAdmin = user?.role === 'admin';

    const handleShowLogin = () => {
        setShowLoginForm(true);
        setShowRegisterForm(false);
    };

    const handleShowRegister = () => {
        setShowLoginForm(false);
        setShowRegisterForm(true);
    };

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
                            <button onClick={handleShowLogin} className="auth-button">Войти</button>
                            <button onClick={handleShowRegister} className="auth-button">Зарегистрироваться</button>
                        </>
                    )}
                </div>
            </header>
            <div className="content">
                <nav id="pageMenu">
                    {pages.map(page => (
                        <div key={page.id} className="page-link">
                            <Link to={`/page/${page.id}`}>{page.title}</Link>
                            {isAdmin && (
                                <>
                                    <button onClick={() => editPage(page.id)} className="edit-button">Редактировать</button>
                                    <button onClick={() => removePage(page.id)} className="remove-button">Удалить</button>
                                </>
                            )}
                        </div>
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
                            {editingPageId !== null ? (
                                <button onClick={savePage}>Сохранить</button>
                            ) : (
                                <button onClick={addPage}>Добавить</button>
                            )}
                        </div>
                    )}
                </main>
                <div className="comment-section">
                    <Comments pageId={0} />
                </div>
            </div>
            <footer>
                <a>Сделали студенты из БНТУ</a>
            </footer>
        </div>
    );
}

export default MainApp;

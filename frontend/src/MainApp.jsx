import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import LoginForm from './LoginForm.jsx';
import RegisterForm from './RegisterForm.jsx';
import TokenService from './services/TokenService.js';
import Comments from './Comments.jsx';
import axios from 'axios';
import './styles.css';
import api from "./services/api";

const Modal = ({ show, onClose, children }) => {
    if (!show) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                {children}
            </div>
        </div>
    );
};

function MainApp() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [editingPageId, setEditingPageId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const pages = useSelector(state => state.pages.pages);
    const pageCount = useSelector(state => state.pages.pageCount);
    const user = useSelector(state => state.user.user);
    const dispatch = useDispatch();
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [showRegisterForm, setShowRegisterForm] = useState(false);

    useEffect(() => {
        const fetchPages = async () => {
            try {
                const response = await api.get('/api/pages');
                dispatch({ type: 'SET_PAGES', payload: response.data });
            } catch (err) {
                console.error('Error fetching pages:', err);
            }
        };

        fetchPages();
    }, [dispatch]);

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

    const addPage = async () => {
        if (title && content) {
            try {
                const response = await api.post('/api/pages', { title, content }, {
                    headers: {
                        'x-access-token': `${TokenService.getLocalAccessToken()}`
                    }
                });
                const newPage = response.data;
                dispatch({ type: 'ADD_PAGE', payload: newPage });
                setTitle('');
                setContent('');
                setEditingPageId(null);
                setShowModal(false);
            } catch (err) {
                console.error('Error adding page:', err);
            }
        }
    };

    const savePage = async () => {
        if (editingPageId !== null && title && content) {
            try {
                const response = await api.put(`/api/pages/${editingPageId}`, { title, content }, {
                    headers: {
                        'x-access-token': `${TokenService.getLocalAccessToken()}`
                    }
                });
                const updatedPage = response.data;
                dispatch({ type: 'UPDATE_PAGE', payload: updatedPage });
                setTitle('');
                setContent('');
                setEditingPageId(null);
                setShowModal(false);
            } catch (err) {
                console.error('Error saving page:', err);
            }
        }
    };

    const editPage = (pageId) => {
        const page = pages.find(p => p.id === pageId);
        setTitle(page.title);
        setContent(page.content);
        setEditingPageId(pageId);
        setShowModal(true);
    };

    const removePage = async (pageId) => {
        try {
            await api.delete(`/api/pages/${pageId}`, {
                headers: {
                    'x-access-token': `${TokenService.getLocalAccessToken()}`
                }
            });
            dispatch({ type: 'REMOVE_PAGE', payload: pageId });
        } catch (err) {
            console.error('Error removing page:', err);
        }
    };

    const handleShowLogin = () => {
        setShowLoginForm(true);
        setShowRegisterForm(false);
    };

    const handleShowRegister = () => {
        setShowLoginForm(false);
        setShowRegisterForm(true);
    };

    const handleShowModal = () => {
        setTitle('');
        setContent('');
        setEditingPageId(null);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div className="app">
            <header>
                <h1>Техническая документация</h1>
                <p>Количество страниц: {pageCount}</p>
                <div className="auth-buttons">
                    {user ? (
                        <>
                            {user?.role === 'admin' && (
                                <button onClick={handleShowModal} className="add-page-button">Добавить страницу</button>
                            )}
                            <button onClick={handleLogout} className="auth-button">Выйти</button>
                        </>
                    ) : (
                        <>
                            <button onClick={handleShowLogin} className="auth-button">Войти</button>
                            <button onClick={handleShowRegister} className="auth-button">Зарегистрироваться</button>
                        </>
                    )}
                </div>
            </header>
            <div className="content">
                <main>
                    <div className="main-content">
                        <article>
                            Приветствуем вас на нашем сайте, посвященном чтению и изучению технической документации!
                            Здесь вы найдете все необходимые ресурсы для того, чтобы углубиться в различные аспекты программирования и разработки.
                            Независимо от вашего уровня опыта, наш сайт предоставляет доступ к высококачественным материалам, которые помогут вам лучше понять и использовать современные технологии.

                            Мы стремимся создать удобную и интуитивно понятную платформу, которая облегчит вам процесс поиска и изучения информации.
                            Благодаря функциональному интерфейсу и удобной навигации, вы сможете быстро находить нужные разделы и статьи. Присоединяйтесь к нашему сообществу и начинайте свое путешествие в мир знаний и новых возможностей!
                        </article>
                        {!user && showLoginForm && (
                            <div className="login-container">
                                <LoginForm onLogin={handleLogin} />
                            </div>
                        )}
                        {!user && showRegisterForm && (
                            <div className="register-container">
                                <RegisterForm onRegister={handleRegister} />
                            </div>
                        )}
                        {user?.role === 'admin' && (
                            <Modal show={showModal} onClose={handleCloseModal}>
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
                                    <button onClick={savePage} className="auth-button">Сохранить</button>
                                ) : (
                                    <button onClick={addPage} className="auth-button">Добавить</button>
                                )}
                                <button onClick={handleCloseModal} className="auth-button">Закрыть</button>
                            </Modal>
                        )}
                    </div>
                </main>
                <div className="pageMenu">
                    {pages.map(page => (
                        <div key={page.id} className="page-link">
                            <Link to={`/page/${page.id}`} className="link-title">{page.title}</Link>
                            {user?.role === 'admin' && (
                                <div className="site-buttons">
                                    <button onClick={() => editPage(page.id)} className="button-edit-with-image"></button>
                                    <button onClick={() => removePage(page.id)} className="button-delete-with-image"></button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <div className="comments-section">
                    <Comments pageId={0} />
                </div>
            </div>
            <footer>
                <a>Кирилл навалил говна в мейн окно</a>
            </footer>
        </div>
    );
}

export default MainApp;

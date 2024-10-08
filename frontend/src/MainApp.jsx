import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
//import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment';
import LoginForm from './LoginForm.jsx';
import RegisterForm from './RegisterForm.jsx';
import TokenService from './services/TokenService.js';
import Comments from './Comments.jsx';
import api from "./services/api";
import SearchModal from './SearchModal.jsx';
import './styles.css';

const Modal = ({ show, onClose, className, children }) => {
    if (!show) return null;

    return (
        <div className={`modal-overlay ${className}`}>
            <div className="modal">
                <button onClick={onClose} className="close-button">&times;</button>
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
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [showRegisterForm, setShowRegisterForm] = useState(false);
    const pages = useSelector(state => state.pages.pages);
    const pageCount = useSelector(state => state.pages.pageCount);
    const user = useSelector(state => state.user.user);
    const dispatch = useDispatch();

    const [showSearchModal, setShowSearchModal] = useState(false);

    const handleOpenSearchModal = () => {
        setShowSearchModal(true);
    };

    const handleCloseSearchModal = () => {
        setShowSearchModal(false);
    };


        useEffect(() => {
            // Тестовый запрос к бэкенду
            const checkBackendConnection = async () => {
                try {
                    const response = await api.get('/api/ping'); // Убедитесь, что у вас есть этот маршрут на бэкенде
                    console.log('Connection to backend is successful:', response.data);
                } catch (error) {
                    console.error('Error connecting to backend:', error.message);
                }
            };

            checkBackendConnection();
        }, []);

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
                <div className="auth-buttons">
                    <button onClick={handleOpenSearchModal} className="auth-button">Поиск</button>
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
                        <Modal show={showSearchModal} onClose={handleCloseSearchModal}>
                            <SearchModal isOpen={showSearchModal} onClose={handleCloseSearchModal} />
                        </Modal>
                        <Modal show={showLoginForm} onClose={() => setShowLoginForm(false)}>
                            <LoginForm onLogin={handleLogin} />
                        </Modal>
                        <Modal show={showRegisterForm} onClose={() => setShowRegisterForm(false)}>
                            <RegisterForm onRegister={handleRegister} />
                        </Modal>
                        {user?.role === 'admin' && (
                            <Modal show={showModal} onClose={handleCloseModal}>
                                <div className="modal-content">
                                    <br />
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={e => setTitle(e.target.value)}
                                        placeholder="Название страницы"
                                        className="modal-title-input"
                                    />
                                    <CKEditor
                                        editor={ClassicEditor}
                                        config={{
                                            plugins: [...ClassicEditor.builtinPlugins ],
                                            toolbar: [
                                                'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote',
                                                '|', 'insertTable', 'tableColumn', 'tableRow', 'mergeTableCells',
                                                '|', 'undo', 'redo'
                                            ]                                        
                                        }}
                                        data={content}
                                        onChange={(event, editor) => {
                                            const data = editor.getData();
                                            setContent(data);
                                        }}
                                    />
                                    <div className="modal-buttons">
                                        {editingPageId !== null ? (
                                            <button onClick={savePage} className="auth-button">Сохранить</button>
                                        ) : (
                                            <button onClick={addPage} className="auth-button">Добавить</button>
                                        )}
                                    </div>
                                </div>
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
                    <Comments pageId={0} />

            </div>
            <footer>
                <article>Сделано во время практики в InDev.by
                </article>
            </footer>
        </div>
    );
}

export default MainApp;

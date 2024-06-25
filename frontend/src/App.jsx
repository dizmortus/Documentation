import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import './styles.css';

function App() {
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const pages = useSelector(state => state.pages.pages);
    const pageCount = useSelector(state => state.pages.pageCount);
    const dispatch = useDispatch();

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
            axios.post('/api/pages', { title, content }, {
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
                    <div key={page.id} className="page-item">
                        <a href={`/api/pages/${page.id}`}>
                            {page.title}
                        </a>
                        <button onClick={() => removePage(page.id)}>Удалить</button>
                        <div dangerouslySetInnerHTML={{ __html: page.content }}></div>
                    </div>
                ))}
            </nav>
            <main>
                <input
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
                <button onClick={addPage}>Добавить</button>
            </main>
            <footer>
                {/* Футер сайта */}
            </footer>
        </div>
    );
}

export default App;

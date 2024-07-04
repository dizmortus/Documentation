import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Comments from './Comments.jsx'; // Import your Comments component
import './styles.css';

function DynamicPage() {
    const { id } = useParams();
    const pages = useSelector(state => state.pages.pages);
    const pageId = parseInt(id, 10); // Преобразование параметра id в число

    // Поиск страницы по ID
    const page = pages.find(page => page.id === pageId);

    if (!page) {
        return <div>Страница не найдена</div>;
    }

    return (
        <div className='NewPagess'>
            <h2>{page.title}</h2>
            <div dangerouslySetInnerHTML={{ __html: page.content }} />
            <Comments pageId={page.id} /> {/* Pass pageId to Comments component */}
        </div>
    );
}

export default DynamicPage;

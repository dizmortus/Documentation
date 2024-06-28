import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

function DynamicPage() {
    const { id } = useParams();
    const pages = useSelector(state => state.pages.pages);
    const page = pages.find(page => page.id === parseInt(id));

    if (!page) {
        return <div>Страница не найдена</div>;
    }

    return (
        <div>
            <h2>{page.title}</h2>
            <div dangerouslySetInnerHTML={{ __html: page.content }} />
        </div>
    );
}

export default DynamicPage;
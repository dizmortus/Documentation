import React from 'react';
import './styles.css';

const NewPage = ({ page, removePage }) => {
    return (
        <div className="page-item">
            <a href={`/api/pages/${page.id}`} target="_blank" rel="noopener noreferrer">{page.title}</a>
            <button onClick={() => removePage(page.id)}>Удалить</button>
        </div>
    );
};

export default NewPage;

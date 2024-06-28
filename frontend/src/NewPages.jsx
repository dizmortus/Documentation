import React from 'react';
import './styles.css';

const NewPage = ({ page, removePage }) => {
    return (
        <div className="page-item">
            <a href={`/api/pages/${page.id}`} target="_blank" rel="noopener noreferrer">{page.title}</a>
            {removePage && <button src="./images/delete.png" onClick={() => removePage(page.id)}></button>}
        </div>
    );
};

export default NewPage;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from "./services/api";
import './SearchModal.css';

function SearchModal({ isOpen, onClose }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = async () => {
        try {
            const response = await api.get(`/api/pages/search?query=${query}`);
            setResults(response.data);
        } catch (err) {
            console.error('Error searching pages:', err);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="search-container">
                    <input
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Введите запрос для поиска..."
                    />
                    <button onClick={handleSearch}>Поиск</button>
                </div>
                <div className="search-results">
                    {results.map(page => (
                        <div key={page.id} className="search-result-item">
                            <Link to={`/page/${page.id}`} onClick={onClose}>
                                {page.title}
                            </Link>
                        </div>
                    ))}
                </div>
                <button className="close-button" onClick={onClose}>
                    Закрыть
                </button>
            </div>
        </div>
    );
}

export default SearchModal;
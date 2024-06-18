// Файл Documentation/frontend/App.js
// Основной файл React приложения

import React, { useState, useEffect } from 'react';

function App() {
  const [pages, setPages] = useState([]);
  const [content, setContent] = useState('');

  useEffect(() => {
    // Получаем список страниц при загрузке компонента
    fetch('/api/pages')
      .then(response => response.json())
      .then(setPages)
      .catch(console.error);
  }, []);

  const addPage = () => {
    if (content) {
      fetch('/api/pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      })
      .then(response => response.json())
      .then(page => {
        setPages([...pages, page]);
        setContent(''); // Очищаем поле ввода после добавления страницы
      })
      .catch(console.error);
    }
  };

  return (
    <div>
      <header>
        <h1>Техническая документация</h1>
      </header>
      <nav id="pageMenu">
        {pages.map(page => (
          <a key={page.id} href={`/api/pages/${page.id}`}>
            {page.title}
          </a>
        ))}
      </nav>
      <main>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          rows="10"
          cols="50"
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

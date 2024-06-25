// Файл Documentation/backend/server.js
// Сервер Express для обработки запросов и динамического создания HTML страниц.

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

require('dotenv').config(); // Загрузка переменных окружения

const app = express(); // Экземпляр приложения

app.use(express.json()); // Middleware для JSON
app.use(express.urlencoded({ extended: true })); 
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);// Middleware для urlencoded данных
app.use(cors()); // CORS для кросс-доменных запросов
app.use(express.static(path.join(__dirname, '..', 'frontend', 'build'))); // Статические файлы React

const pagesDir = path.join(__dirname, 'pages'); // Папка для страниц
const sequelize = require('./config/database');
const User = require('./models/User');
sequelize.sync().then(() => {
  console.log("Database synchronized");
});
// Проверка существования папки или её создание
fs.access(pagesDir, fs.constants.F_OK)
  .catch(() => {
    fs.mkdir(pagesDir, { recursive: true }).catch(err => console.error(err));
  });

// POST: Создание новой страницы
app.post('/api/pages', async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) return res.status(400).send('Title and content are required');

  const pageId = Date.now().toString();
  const newPagePath = path.join(pagesDir, `${pageId}.html`);

  const pageContent = `
    <!DOCTYPE html>
    <html lang="ru">
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      <link rel="stylesheet" href="styles.css">
    </head>
    <body>
      <h2>${content}</h2>
    </body>
    </html>
  `;

  try {
    await fs.writeFile(newPagePath, pageContent);
    res.status(201).json({ id: pageId, title });
  } catch (err) {
    console.error(err);
    return res.status(500).send('Error creating page');
  }
});

// DELETE: Удаление страницы по ID
app.delete('/api/pages/:id', async (req, res) => {
  const pageId = req.params.id;
  const pagePath = path.join(pagesDir, `${pageId}.html`);

  try {
    await fs.unlink(pagePath); // Удаляем файл страницы
    res.status(200).json({ response: 'success' });
  } catch (err) {
    if (err.code === 'ENOENT') return res.status(404).send('Page not found');
    console.error(err);
    return res.status(500).send('Error deleting page');
  }
});

// GET: Чтение страницы по ID
app.get('/api/pages/:id', async (req, res) => {
  const pageId = req.params.id;
  const pagePath = path.join(pagesDir, `${pageId}.html`);

  try {
    const content = await fs.readFile(pagePath, 'utf8');
    res.setHeader('Content-Type', 'text/html');
    res.send(content);
  } catch (err) {
    if (err.code === 'ENOENT') return res.status(404).send('Page not found');
    console.error(err);
    return res.status(500).send('Error reading page');
  }
});
/* 
app.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    if (req.user.role === 'admin') {
      //res.render('admin', { user: req.user });
    } else {
      //res.render('user', { user: req.user });
    }
  } else {
    //res.render('index');
  }
});
// Маршрут, доступный только админам
app.get('/admin/add-page', checkRole('admin'), (req, res) => {
  //res.render('add-page');
});

// Маршрут для профиля пользователя
app.get('/profile', (req, res) => {
  if (req.isAuthenticated()) {
    //res.render('profile', { user: req.user });
  } else {
    //res.status(401).render('error', { message: 'Unauthorized' });
  }
});
*/
// GET: Список всех страниц
app.get('/api/pages', async (req, res) => {
  try {
    const files = await fs.readdir(pagesDir);
    const pages = await Promise.all(files.map(async (file) => {
      const content = await fs.readFile(path.join(pagesDir, file), 'utf8');
      const title = content.match(/<title>(.*?)<\/title>/)?.[1] || path.basename(file, '.html');
      return { id: path.basename(file, '.html'), title };
    }));
    res.json(pages);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Error retrieving pages');
  }
});
app.use('/api/auth', require('./routes/auth'));
const PORT = process.env.PORT || 3000; // Порт сервера
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`)); // Запуск сервера

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const path = require('path');


require('dotenv').config(); // Загрузка переменных окружения

const app = express(); // Экземпляр приложения

const corsOptions = {
  origin: ['https://documentation-5o5l.onrender.com'], // Укажите фронтенд URL
  credentials: true, // Для поддержки кук и сессий
};

app.use(cors(corsOptions)); // Включить CORS


app.use(cors()); // CORS для кросс-доменных запросов
app.use(express.json()); // Middleware для JSON
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport); // Middleware для urlencoded данных

app.use(express.static(path.join(__dirname, '..', 'frontend', 'build'))); // Статические файлы React

const db = require('./config/database');


db.sequelize.sync().then(() => {
  console.log("Database synchronized");
});
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next(); // Обязательно вызываем next(), чтобы передать управление дальше
});

const router = express.Router();

router.get('/ping', (req, res) => {
  res.json({ message: 'Backend is running' });
});

module.exports = router;


app.use('/api/auth', require('./routes/auth'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/pages', require('./routes/pages'));

// Handle React routing, return all requests to React app
//app.get('*', (req, res) => {
//  res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));
//});

const PORT = process.env.PORT || 3000; // Порт сервера
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`)); // Запуск сервера

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Загрузка переменных окружения

const app = express(); // Экземпляр приложения
const sequelize = require('./config/database');

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

sequelize.sync().then(() => {
  console.log("Database synchronized");
});

function isAuthenticated(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).send('Unauthorized');

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).send('Unauthorized');

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error(err);
      return res.status(401).send('Unauthorized');
    }
    req.user = user;
    next();
  });
}

app.use('/api/auth', require('./routes/auth'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/pages', require('./routes/pages'));

app.get('/profile', isAuthenticated, (req, res) => {
  res.send(`<h1>Profile of ${req.user.username}</h1><p>Role: ${req.user.role}</p><a href="/logout">Logout</a>`);
});

const PORT = process.env.PORT || 3000; // Порт сервера
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`)); // Запуск сервера

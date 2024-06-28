const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const path = require('path');


require('dotenv').config(); // Загрузка переменных окружения

const app = express(); // Экземпляр приложения


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




app.use('/api/auth', require('./routes/auth'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/pages', require('./routes/pages'));



const PORT = process.env.PORT || 3000; // Порт сервера
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`)); // Запуск сервера

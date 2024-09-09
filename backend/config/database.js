const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  port: process.env.DB_PORT,
  dialectOptions: {
    ssl: {
      require: true, // Обязательно использовать SSL
      rejectUnauthorized: true // Разрешить небезопасные сертификаты, если необходимо
    }
  }
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Модели
db.user = require("../models/User.js")(sequelize, Sequelize);
db.refreshToken = require("../models/refreshToken.js")(sequelize, Sequelize);
db.comment = require("../models/Comment.js")(sequelize, Sequelize);
db.page = require("../models/Page.js")(sequelize, Sequelize);

// Связи
db.refreshToken.belongsTo(db.user, {
  foreignKey: 'userId', targetKey: 'id'
});
db.user.hasOne(db.refreshToken, {
  foreignKey: 'userId', targetKey: 'id'
});

// Проверка связей, если есть
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Аутентификация базы данных
sequelize.authenticate()
    .then(() => console.log('Database connected...'))
    .catch(err => console.log('Error: ' + err));

module.exports = db;

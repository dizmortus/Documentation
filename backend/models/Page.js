const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Page = sequelize.define('Page', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    hooks: {
        // Хук при создании страницы
        async afterCreate(page) {
            try {
                // Создание записи в базе данных
                await Page.create({ id: page.id });
                console.log(`Page ${page.id} created in database.`);
            } catch (err) {
                console.error('Error creating page in database:', err);
            }
        },
        // Хук при удалении страницы
        async afterDestroy(page) {
            try {
                // Удаление записи из базы данных
                await Page.destroy({ where: { id: page.id } });
                console.log(`Page ${page.id} deleted from database.`);
            } catch (err) {
                console.error('Error deleting page from database:', err);
            }
        }
    }
});

module.exports = Page;

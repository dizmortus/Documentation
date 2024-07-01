const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const Page = sequelize.define('Page', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        createdBy: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        updatedBy: {
            type: DataTypes.INTEGER,
            allowNull: true
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
                    console.log(`Page ${page.id} created in database.`);
                } catch (err) {
                    console.error('Error creating page in database:', err);
                }
            },
            // Хук при обновлении страницы
            async beforeUpdate(page) {
                page.updatedAt = new Date();
            },
            // Хук при удалении страницы
            async afterDestroy(page) {
                try {
                    console.log(`Page ${page.id} deleted from database.`);
                } catch (err) {
                    console.error('Error deleting page from database:', err);
                }
            }
        }
    });

    return Page;
}

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

module.exports = (sequelize, Sequelize) => {
    const Comment = sequelize.define('Comment', {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        pageId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    });

    Comment.associate = (models) => {
        Comment.belongsTo(models.user, { foreignKey: 'userId', as: 'user' });
    };

    return Comment;
}

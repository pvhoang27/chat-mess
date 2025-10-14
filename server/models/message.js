const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const Message = sequelize.define('Message', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    senderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    receiverId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    }
}, {
    tableName: 'messages',
    timestamps: true, // Tự động thêm createdAt và updatedAt
});

module.exports = Message;

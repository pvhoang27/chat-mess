const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const Friendship = sequelize.define('Friendship', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    requesterId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    addresseeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    status: {
        type: DataTypes.ENUM('pending', 'accepted', 'blocked'),
        allowNull: false,
        defaultValue: 'pending'
    }
}, {
    tableName: 'friendships',
    timestamps: true
});

// KHÔNG CÓ DÒNG ĐỊNH NGHĨA QUAN HỆ NÀO Ở ĐÂY

module.exports = Friendship;
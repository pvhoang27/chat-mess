const { Op } = require('sequelize');
const User = require('../models/user');
const Message = require('../models/message');

// API tìm kiếm người dùng
exports.searchUsers = async (req, res) => {
    try {
        const { query } = req.query;
        const currentUserId = req.user.id;
        if (!query) return res.status(200).json([]);

        const users = await User.findAll({
            where: {
                username: { [Op.like]: `%${query}%` },
                id: { [Op.ne]: currentUserId }
            },
            attributes: ['id', 'username']
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// API lấy danh sách các cuộc trò chuyện
exports.getConversations = async (req, res) => {
    const currentUserId = req.user.id;
    try {
        const messages = await Message.findAll({
            where: {
                [Op.or]: [{ senderId: currentUserId }, { receiverId: currentUserId }]
            },
            order: [['createdAt', 'DESC']]
        });

        const userIds = new Set();
        messages.forEach(msg => {
            if (msg.senderId !== currentUserId) userIds.add(msg.senderId);
            if (msg.receiverId !== currentUserId) userIds.add(msg.receiverId);
        });

        const conversations = await User.findAll({
            where: { id: [...userIds] },
            attributes: ['id', 'username']
        });

        res.status(200).json(conversations);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// API lấy lịch sử tin nhắn với một người
exports.getMessageHistory = async (req, res) => {
    const currentUserId = req.user.id;
    const { otherUserId } = req.params;

    try {
        const messages = await Message.findAll({
            where: {
                [Op.or]: [
                    { senderId: currentUserId, receiverId: otherUserId },
                    { senderId: otherUserId, receiverId: currentUserId }
                ]
            },
            order: [['createdAt', 'ASC']]
        });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};
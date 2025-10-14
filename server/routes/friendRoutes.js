const express = require('express');
const router = express.Router();
const friendController = require('../controllers/friendController');
const authMiddleware = require('../middleware/authMiddleware');

// Áp dụng middleware xác thực cho tất cả các route
router.use(authMiddleware);

// Route để tìm kiếm user
// GET /api/friends/search
router.get('/search', friendController.searchUsers);

// Route để lấy danh sách các cuộc trò chuyện
// GET /api/friends/conversations
router.get('/conversations', friendController.getConversations);

// Route để lấy lịch sử tin nhắn
// GET /api/friends/messages/:otherUserId
router.get('/messages/:otherUserId', friendController.getMessageHistory);

module.exports = router;
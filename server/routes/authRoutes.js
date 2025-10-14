const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route cho việc đăng ký tài khoản mới
// POST /api/auth/register
router.post('/register', authController.register);

// Route cho việc đăng nhập
// POST /api/auth/login
router.post('/login', authController.login);

module.exports = router;

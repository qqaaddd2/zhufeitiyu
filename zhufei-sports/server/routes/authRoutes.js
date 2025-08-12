const express = require('express');
const { adminLogin, getCurrentAdmin } = require('../controllers/authController');
const { authenticateAdmin } = require('../middleware/auth');

const router = express.Router();

// 管理员登录
router.post('/login', adminLogin);

// 获取当前登录管理员信息
router.get('/me', authenticateAdmin, getCurrentAdmin);

module.exports = router;
    
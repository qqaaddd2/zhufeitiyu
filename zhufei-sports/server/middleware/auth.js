const jwt = require('jsonwebtoken');
const config = require('../config/config');

// 验证管理员身份
const authenticateAdmin = (req, res, next) => {
  try {
    // 从请求头获取token
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: '未提供身份验证令牌' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // 验证token
    const decoded = jwt.verify(token, config.jwt.secret);
    
    // 将解码后的用户信息添加到请求对象
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: '身份验证失败或令牌已过期' });
  }
};

module.exports = { authenticateAdmin };
    
const jwt = require('jsonwebtoken');
const config = require('../config/config');

// 生成管理员令牌
const generateAdminToken = (admin) => {
  return jwt.sign(
    { id: admin.id, username: admin.username, name: admin.name },
    config.jwt.secret,
    { expiresIn: config.jwt.expire }
  );
};

module.exports = { generateAdminToken };
    
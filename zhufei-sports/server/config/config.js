const dotenv = require('dotenv');

// 加载环境变量
dotenv.config();

module.exports = {
  // 服务器端口配置
  port: process.env.PORT || 3000,
  
  // JWT认证配置
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key', // 生产环境需更换为安全密钥
    expire: process.env.JWT_EXPIRE || '7d' // 令牌过期时间
  },
  
  // CORS跨域配置
  corsOptions: {
    origin: process.env.ALLOWED_ORIGINS 
      ? process.env.ALLOWED_ORIGINS.split(',') 
      : ['http://localhost:5500', 'http://127.0.0.1:5500'], // 允许的前端域名
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // 允许的HTTP方法
    allowedHeaders: ['Content-Type', 'Authorization'] // 允许的请求头
  },
  
  // 日志配置
  logger: {
    level: process.env.LOG_LEVEL || 'info',
    enabled: process.env.LOG_ENABLED !== 'false'
  }
};
    
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config/config');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// 路由导入
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

// 创建Express应用
const app = express();

// 中间件
app.use(cors(config.corsOptions));
app.use(express.json());
app.use(morgan('dev'));

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/bookings', bookingRoutes);

// 根路由
app.get('/', (req, res) => {
  res.send('助飞体育API服务器运行中');
});

// 错误处理中间件
app.use(notFound);
app.use(errorHandler);

module.exports = app;
    
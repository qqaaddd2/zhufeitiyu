// 全局错误处理中间件
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  // 默认错误状态码和消息
  const statusCode = err.statusCode || 500;
  const message = err.message || '服务器内部错误';
  
  res.status(statusCode).json({
    success: false,
    error: message,
    // 开发环境下显示错误堆栈
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// 404错误处理
const notFound = (req, res, next) => {
  const error = new Error(`未找到 - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

module.exports = { errorHandler, notFound };
    
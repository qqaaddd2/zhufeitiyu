const app = require('./app');
const config = require('./config/config');

// 启动服务器
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});

// 处理未捕获的异常
process.on('uncaughtException', (err) => {
  console.error('未捕获的异常:', err);
  // 在生产环境中，可能需要优雅地关闭服务器
  // process.exit(1);
});

// 处理未处理的Promise拒绝
process.on('unhandledRejection', (err) => {
  console.error('未处理的Promise拒绝:', err);
  // 在生产环境中，可能需要优雅地关闭服务器
  // process.exit(1);
});
    
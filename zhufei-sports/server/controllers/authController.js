const Admin = require('../models/Admin');
const { validateLogin } = require('../utils/validation');
const { generateAdminToken } = require('../utils/generateToken');

// 管理员登录
const adminLogin = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    
    // 验证输入
    const { isValid, errors } = validateLogin({ username, password });
    if (!isValid) {
      return res.status(400).json({ message: '输入数据无效', errors });
    }
    
    // 查找管理员
    const admin = await Admin.findByUsername(username);
    if (!admin) {
      return res.status(401).json({ message: '用户名或密码不正确' });
    }
    
    // 验证密码
    const isPasswordValid = await Admin.verifyPassword(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: '用户名或密码不正确' });
    }
    
    // 生成令牌
    const token = generateAdminToken(admin);
    
    // 返回管理员信息和令牌
    res.status(200).json({
      success: true,
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        name: admin.name
      }
    });
  } catch (error) {
    next(error);
  }
};

// 获取当前登录管理员信息
const getCurrentAdmin = async (req, res, next) => {
  try {
    const admin = await Admin.getAdminById(req.admin.id);
    if (!admin) {
      return res.status(404).json({ message: '管理员不存在' });
    }
    
    res.status(200).json({
      success: true,
      admin
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { adminLogin, getCurrentAdmin };
    
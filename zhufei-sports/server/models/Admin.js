const pool = require('../config/db');
const bcrypt = require('bcryptjs');

class Admin {
  // 根据用户名查找管理员
  static async findByUsername(username) {
    const [rows] = await pool.execute(
      'SELECT * FROM admin WHERE username = ?',
      [username]
    );
    return rows[0];
  }
  
  // 验证密码
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
  
  // 获取管理员信息
  static async getAdminById(id) {
    const [rows] = await pool.execute(
      'SELECT id, username, name, created_at FROM admin WHERE id = ?',
      [id]
    );
    return rows[0];
  }
}

module.exports = Admin;
    
const pool = require('../config/db');

class Course {
  // 获取所有课程
  static async getAllCourses() {
    const [rows] = await pool.execute('SELECT * FROM courses ORDER BY id');
    return rows;
  }
  
  // 根据ID获取课程
  static async getCourseById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM courses WHERE id = ?',
      [id]
    );
    return rows[0];
  }
  
  // 根据ID获取课程名称
  static async getCourseNameById(id) {
    const [rows] = await pool.execute(
      'SELECT name FROM courses WHERE id = ?',
      [id]
    );
    return rows[0] ? rows[0].name : null;
  }
}

module.exports = Course;
    
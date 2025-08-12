const pool = require('../config/db');

class Booking {
  // 创建新预约
  static async create(booking) {
    const { 
      booking_number, name, phone, course_id, 
      booking_date, booking_time, experience, message 
    } = booking;
    
    const [result] = await pool.execute(
      `INSERT INTO bookings 
       (booking_number, name, phone, course_id, booking_date, booking_time, experience, message) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        booking_number, name, phone, course_id, 
        booking_date, booking_time, experience, message
      ]
    );
    
    return result.insertId;
  }
  
  // 获取所有预约
  static async getAllBookings(status = null) {
    let query = `
      SELECT b.*, c.name as course_name 
      FROM bookings b
      JOIN courses c ON b.course_id = c.id
      ORDER BY b.created_at DESC
    `;
    
    const params = [];
    
    if (status) {
      query = `
        SELECT b.*, c.name as course_name 
        FROM bookings b
        JOIN courses c ON b.course_id = c.id
        WHERE b.status = ?
        ORDER BY b.created_at DESC
      `;
      params.push(status);
    }
    
    const [rows] = await pool.execute(query, params);
    return rows;
  }
  
  // 根据ID获取预约
  static async getBookingById(id) {
    const [rows] = await pool.execute(
      `SELECT b.*, c.name as course_name 
       FROM bookings b
       JOIN courses c ON b.course_id = c.id
       WHERE b.id = ?`,
      [id]
    );
    return rows[0];
  }
  
  // 根据预约编号获取预约
  static async getBookingByNumber(bookingNumber) {
    const [rows] = await pool.execute(
      `SELECT b.*, c.name as course_name 
       FROM bookings b
       JOIN courses c ON b.course_id = c.id
       WHERE b.booking_number = ?`,
      [bookingNumber]
    );
    return rows[0];
  }
  
  // 更新预约状态和备注
  static async updateStatus(id, status, notes) {
    const [result] = await pool.execute(
      'UPDATE bookings SET status = ?, notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, notes, id]
    );
    return result.affectedRows > 0;
  }
  
  // 获取今日预约数量
  static async getTodayBookingsCount() {
    const [rows] = await pool.execute(
      `SELECT COUNT(*) as count 
       FROM bookings 
       WHERE DATE(created_at) = CURDATE()`
    );
    return rows[0].count;
  }
  
  // 获取状态统计
  static async getStatusCount() {
    const [rows] = await pool.execute(
      `SELECT status, COUNT(*) as count 
       FROM bookings 
       GROUP BY status`
    );
    
    const stats = {
      pending: 0,
      processed: 0
    };
    
    rows.forEach(row => {
      if (stats.hasOwnProperty(row.status)) {
        stats[row.status] = row.count;
      }
    });
    
    return stats;
  }
  
  // 搜索预约
  static async searchBookings(keyword) {
    const [rows] = await pool.execute(
      `SELECT b.*, c.name as course_name 
       FROM bookings b
       JOIN courses c ON b.course_id = c.id
       WHERE 
         b.booking_number LIKE ? OR
         b.name LIKE ? OR
         b.phone LIKE ? OR
         c.name LIKE ?
       ORDER BY b.created_at DESC`,
      [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`, `%${keyword}%`]
    );
    
    return rows;
  }
}

module.exports = Booking;
    
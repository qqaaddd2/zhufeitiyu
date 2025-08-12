const Booking = require('../models/Booking');
const Course = require('../models/Course');
const { validateBooking } = require('../utils/validation');
const { generateBookingNumber } = require('../utils/generateBookingNumber');

// 创建新预约
const createBooking = async (req, res, next) => {
  try {
    const bookingData = req.body;
    
    // 验证预约数据
    const { isValid, errors } = validateBooking(bookingData);
    if (!isValid) {
      return res.status(400).json({ message: '预约数据无效', errors });
    }
    
    // 验证课程是否存在
    const course = await Course.getCourseById(bookingData.course_id);
    if (!course) {
      return res.status(400).json({ message: '所选课程不存在' });
    }
    
    // 生成预约编号
    const bookingNumber = generateBookingNumber();
    
    // 创建预约
    const bookingId = await Booking.create({
      ...bookingData,
      booking_number: bookingNumber
    });
    
    // 获取创建的预约详情
    const createdBooking = await Booking.getBookingById(bookingId);
    
    res.status(201).json({
      success: true,
      message: '预约成功',
      data: createdBooking
    });
  } catch (error) {
    next(error);
  }
};

// 获取所有预约
const getAllBookings = async (req, res, next) => {
  try {
    const { status } = req.query;
    const bookings = await Booking.getAllBookings(status);
    
    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

// 获取单个预约详情
const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.getBookingById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: '预约不存在' });
    }
    
    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// 更新预约状态
const updateBookingStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    
    if (!status || !['pending', 'processed'].includes(status)) {
      return res.status(400).json({ message: '请提供有效的预约状态' });
    }
    
    const booking = await Booking.getBookingById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: '预约不存在' });
    }
    
    // 更新预约状态
    const updated = await Booking.updateStatus(req.params.id, status, notes || '');
    if (!updated) {
      return res.status(500).json({ message: '更新预约状态失败' });
    }
    
    // 获取更新后的预约详情
    const updatedBooking = await Booking.getBookingById(req.params.id);
    
    res.status(200).json({
      success: true,
      message: '预约状态已更新',
      data: updatedBooking
    });
  } catch (error) {
    next(error);
  }
};

// 获取预约统计数据
const getBookingStats = async (req, res, next) => {
  try {
    const todayCount = await Booking.getTodayBookingsCount();
    const statusCount = await Booking.getStatusCount();
    
    res.status(200).json({
      success: true,
      data: {
        today: todayCount,
        pending: statusCount.pending,
        processed: statusCount.processed,
        total: statusCount.pending + statusCount.processed
      }
    });
  } catch (error) {
    next(error);
  }
};

// 搜索预约
const searchBookings = async (req, res, next) => {
  try {
    const { keyword } = req.query;
    
    if (!keyword || keyword.trim() === '') {
      return res.status(400).json({ message: '请提供搜索关键词' });
    }
    
    const bookings = await Booking.searchBookings(keyword);
    
    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  getBookingStats,
  searchBookings
};
    
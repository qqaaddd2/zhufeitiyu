const express = require('express');
const {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  getBookingStats,
  searchBookings
} = require('../controllers/bookingController');
const { authenticateAdmin } = require('../middleware/auth');

const router = express.Router();

// 创建新预约 (无需认证)
router.post('/', createBooking);

// 管理员接口 (需要认证)
router.get('/', authenticateAdmin, getAllBookings);
router.get('/stats', authenticateAdmin, getBookingStats);
router.get('/search', authenticateAdmin, searchBookings);
router.get('/:id', authenticateAdmin, getBookingById);
router.put('/:id/status', authenticateAdmin, updateBookingStatus);

module.exports = router;
    
const express = require('express');
const { getAllCourses, getCourseById } = require('../controllers/courseController');

const router = express.Router();

// 获取所有课程
router.get('/', getAllCourses);

// 根据ID获取课程
router.get('/:id', getCourseById);

module.exports = router;
    
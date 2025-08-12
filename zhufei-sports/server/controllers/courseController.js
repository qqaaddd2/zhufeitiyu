const Course = require('../models/Course');

// 获取所有课程
const getAllCourses = async (req, res, next) => {
  try {
    const courses = await Course.getAllCourses();
    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    next(error);
  }
};

// 根据ID获取课程
const getCourseById = async (req, res, next) => {
  try {
    const course = await Course.getCourseById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: '课程不存在' });
    }
    
    res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllCourses, getCourseById };
    
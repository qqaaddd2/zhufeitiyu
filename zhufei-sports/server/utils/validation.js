// 验证预约数据
const validateBooking = (booking) => {
  const errors = [];
  
  if (!booking.name || booking.name.trim() === '') {
    errors.push('姓名不能为空');
  }
  
  if (!booking.phone || booking.phone.trim() === '') {
    errors.push('联系电话不能为空');
  } else if (!/^1[3-9]\d{9}$/.test(booking.phone)) {
    errors.push('请输入有效的手机号码');
  }
  
  if (!booking.course_id) {
    errors.push('请选择课程');
  }
  
  if (!booking.booking_date) {
    errors.push('请选择预约日期');
  } else {
    // 检查日期是否为未来日期
    const selectedDate = new Date(booking.booking_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      errors.push('预约日期不能是过去的日期');
    }
  }
  
  if (!booking.booking_time) {
    errors.push('请选择预约时间');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// 验证管理员登录数据
const validateLogin = (credentials) => {
  const errors = [];
  
  if (!credentials.username || credentials.username.trim() === '') {
    errors.push('用户名不能为空');
  }
  
  if (!credentials.password || credentials.password.trim() === '') {
    errors.push('密码不能为空');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = { validateBooking, validateLogin };
    
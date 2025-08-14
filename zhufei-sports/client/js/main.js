/**
 * 客户端主脚本
 * 负责前台页面公共功能、数据加载和交互处理
 */
document.addEventListener('DOMContentLoaded', async () => {
    // 初始化API基础路径（已统一为相对路径）
    window.API_BASE_URL = '/api';
    
    // 初始化页面模块
    initPageModules();
    
    // 加载公共数据
    try {
        await Promise.all([
            loadCourses(),
            loadTeachers(),
            loadAdvantages(),
            loadFaqs(),
            loadComments()
        ]);
    } catch (error) {
        console.error('数据加载失败:', error);
        showNotification('页面数据加载失败，请刷新重试', 'error');
    }
    
    // 初始化导航交互
    initNavigation();
    
    // 初始化滚动动画
    initScrollAnimations();
});

/**
 * 初始化页面模块
 */
function initPageModules() {
    // 初始化预约表单
    if (document.getElementById('appointmentForm')) {
        import('./appointment.js').then(module => {
            module.initAppointmentForm();
        });
    }
    
    // 初始化评论展示
    if (document.querySelector('.comments-container')) {
        import('./comment.js').then(module => {
            module.initCommentDisplay();
        });
    }
}

/**
 * 加载课程数据
 */
async function loadCourses() {
    const courseContainer = document.querySelector('.courses-container');
    if (!courseContainer) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/courses?status=1`);
        if (!response.ok) throw new Error('课程数据加载失败');
        
        const courses = await response.json();
        if (courses.length === 0) {
            courseContainer.innerHTML = '<p class="text-center py-8">暂无课程数据</p>';
            return;
        }
        
        let html = '';
        courses.forEach(course => {
            html += `
            <div class="course-card bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition">
                <img src="${course.cover ? `/uploads/${course.cover}` : '/images/course-default.jpg'}" 
                     alt="${course.title}" class="w-full h-48 object-cover">
                <div class="p-4">
                    <div class="flex justify-between items-start mb-2">
                        <h3 class="font-bold text-lg">${course.title}</h3>
                        <span class="text-primary font-bold">¥${course.price}</span>
                    </div>
                    <p class="text-gray-600 text-sm mb-3 line-clamp-2">${course.description || '暂无课程介绍'}</p>
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-gray-500">${course.duration || '90分钟'}</span>
                        <button class="text-primary hover:text-primary/80 text-sm font-medium" 
                                onclick="showAppointmentModal('${course.id}', '${escapeHtml(course.title)}')">
                            立即预约 <i class="fa fa-arrow-right ml-1"></i>
                        </button>
                    </div>
                </div>
            </div>
            `;
        });
        
        courseContainer.innerHTML = html;
    } catch (error) {
        console.error('加载课程失败:', error);
        courseContainer.innerHTML = '<p class="text-center py-8 text-red-500">课程数据加载失败</p>';
    }
}

/**
 * 加载教练数据
 */
async function loadTeachers() {
    const teacherContainer = document.querySelector('.teachers-container');
    if (!teacherContainer) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/teachers?status=1`);
        if (!response.ok) throw new Error('教练数据加载失败');
        
        const teachers = await response.json();
        if (teachers.length === 0) {
            teacherContainer.innerHTML = '<p class="text-center py-8">暂无教练数据</p>';
            return;
        }
        
        let html = '';
        teachers.forEach(teacher => {
            html += `
            <div class="teacher-card bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition">
                <img src="${teacher.avatar ? `/uploads/${teacher.avatar}` : '/images/teacher-default.jpg'}" 
                     alt="${teacher.name}" class="w-full h-64 object-cover">
                <div class="p-4 text-center">
                    <h3 class="font-bold text-lg">${teacher.name}</h3>
                    <p class="text-gray-600 mb-2">${teacher.title || '专业教练'}</p>
                    <p class="text-sm text-gray-500 mb-3">教龄 ${teacher.experience || 0} 年</p>
                    <p class="text-sm text-gray-600 line-clamp-3">${teacher.description || '暂无教练介绍'}</p>
                </div>
            </div>
            `;
        });
        
        teacherContainer.innerHTML = html;
    } catch (error) {
        console.error('加载教练失败:', error);
        teacherContainer.innerHTML = '<p class="text-center py-8 text-red-500">教练数据加载失败</p>';
    }
}

/**
 * 加载教学优势
 */
async function loadAdvantages() {
    const advantageContainer = document.querySelector('.advantages-container');
    if (!advantageContainer) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/advantages`);
        if (!response.ok) throw new Error('教学优势加载失败');
        
        const advantages = await response.json();
        if (advantages.length === 0) return;
        
        let html = '';
        advantages.forEach(advantage => {
            html += `
            <div class="advantage-item flex items-start p-3 hover:bg-gray-50 rounded-lg transition">
                <div class="advantage-icon mr-4 text-primary text-2xl">
                    <i class="${advantage.icon || 'fa-trophy'}"></i>
                </div>
                <div>
                    <h3 class="font-bold mb-1">${advantage.title}</h3>
                    <p class="text-gray-600 text-sm">${advantage.description}</p>
                </div>
            </div>
            `;
        });
        
        advantageContainer.innerHTML = html;
    } catch (error) {
        console.error('加载教学优势失败:', error);
    }
}

/**
 * 加载常见问题
 */
async function loadFaqs() {
    const faqContainer = document.querySelector('.faqs-container');
    if (!faqContainer) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/faqs`);
        if (!response.ok) throw new Error('常见问题加载失败');
        
        const faqs = await response.json();
        if (faqs.length === 0) return;
        
        let html = '';
        faqs.forEach((faq, index) => {
            html += `
            <div class="faq-item border-b border-gray-100 last:border-0">
                <button class="faq-question w-full flex justify-between items-center py-4 text-left font-medium" 
                        onclick="toggleFaq(${index})">
                    <span>${faq.question}</span>
                    <i class="fa fa-chevron-down text-gray-400 transition-transform duration-300"></i>
                </button>
                <div class="faq-answer text-gray-600 pb-4 hidden">
                    ${faq.answer}
                </div>
            </div>
            `;
        });
        
        faqContainer.innerHTML = html;
    } catch (error) {
        console.error('加载常见问题失败:', error);
    }
}

/**
 * 加载学员评价
 */
async function loadComments() {
    const commentContainer = document.querySelector('.comments-container');
    if (!commentContainer) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/comments`);
        if (!response.ok) throw new Error('学员评价加载失败');
        
        const comments = await response.json();
        if (comments.length === 0) {
            commentContainer.innerHTML = '<p class="text-center py-8">暂无学员评价</p>';
            return;
        }
        
        let html = '';
        comments.forEach(comment => {
            html += `
            <div class="comment-item bg-white p-4 rounded-lg shadow-sm mb-4">
                <div class="flex items-center mb-3">
                    <img src="${comment.avatar ? `/uploads/${comment.avatar}` : '/images/user-default.jpg'}" 
                         alt="${comment.name}" class="w-10 h-10 rounded-full mr-3">
                    <div>
                        <h4 class="font-medium">${comment.name}</h4>
                        <p class="text-sm text-gray-500">${comment.course_name || '未知课程'}</p>
                    </div>
                </div>
                <div class="flex text-yellow-400 mb-2">
                    ${generateStarRating(comment.rating || 5)}
                </div>
                <p class="text-gray-600">${comment.content}</p>
            </div>
            `;
        });
        
        commentContainer.innerHTML = html;
    } catch (error) {
        console.error('加载学员评价失败:', error);
        commentContainer.innerHTML = '<p class="text-center py-8 text-red-500">评价数据加载失败</p>';
    }
}

/**
 * 初始化导航交互
 */
function initNavigation() {
    // 移动端菜单切换
    const menuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // 导航栏滚动效果
    const header = document.querySelector('header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 50) {
            header.classList.add('bg-white', 'shadow-sm');
            header.classList.remove('bg-transparent');
        } else {
            header.classList.remove('bg-white', 'shadow-sm');
            header.classList.add('bg-transparent');
        }
        
        lastScrollTop = scrollTop;
    });
}

/**
 * 初始化滚动动画
 */
function initScrollAnimations() {
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

/**
 * 生成星级评分HTML
 */
function generateStarRating(rating) {
    let html = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) {
            html += '<i class="fa fa-star"></i>';
        } else if (i === fullStars + 1 && hasHalfStar) {
            html += '<i class="fa fa-star-half-o"></i>';
        } else {
            html += '<i class="fa fa-star-o"></i>';
        }
    }
    
    return html;
}

/**
 * 显示预约模态框
 */
function showAppointmentModal(courseId, courseName) {
    const modal = document.getElementById('appointmentModal');
    if (modal) {
        // 填充课程信息到预约表单
        document.getElementById('appointmentCourseId').value = courseId;
        document.getElementById('appointmentCourseName').value = courseName;
        document.getElementById('appointmentCourseDisplay').textContent = courseName;
        
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

/**
 * 关闭预约模态框
 */
function closeAppointmentModal() {
    const modal = document.getElementById('appointmentModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

/**
 * 切换FAQ显示/隐藏
 */
function toggleFaq(index) {
    const faqItems = document.querySelectorAll('.faq-item');
    const answer = faqItems[index].querySelector('.faq-answer');
    const icon = faqItems[index].querySelector('.fa-chevron-down');
    
    answer.classList.toggle('hidden');
    icon.classList.toggle('rotate-180');
}

/**
 * 显示通知提示
 */
function showNotification(message, type = 'success', duration = 3000) {
    // 创建通知容器（如果不存在）
    let notificationContainer = document.getElementById('notificationContainer');
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notificationContainer';
        notificationContainer.className = 'fixed top-4 right-4 z-50 flex flex-col gap-3';
        document.body.appendChild(notificationContainer);
    }
    
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = 'px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 transform transition-all duration-300 opacity-0 translate-y-4 max-w-sm';
    
    // 设置通知类型样式
    switch (type) {
        case 'success':
            notification.classList.add('bg-green-50', 'border-l-4', 'border-green-500', 'text-green-800');
            notification.innerHTML = `<i class="fa fa-check-circle text-green-500"></i><span>${message}</span>`;
            break;
        case 'error':
            notification.classList.add('bg-red-50', 'border-l-4', 'border-red-500', 'text-red-800');
            notification.innerHTML = `<i class="fa fa-exclamation-circle text-red-500"></i><span>${message}</span>`;
            break;
        case 'warning':
            notification.classList.add('bg-yellow-50', 'border-l-4', 'border-yellow-500', 'text-yellow-800');
            notification.innerHTML = `<i class="fa fa-exclamation-triangle text-yellow-500"></i><span>${message}</span>`;
            break;
        case 'info':
            notification.classList.add('bg-blue-50', 'border-l-4', 'border-blue-500', 'text-blue-800');
            notification.innerHTML = `<i class="fa fa-info-circle text-blue-500"></i><span>${message}</span>`;
            break;
    }
    
    // 添加到容器并显示
    notificationContainer.appendChild(notification);
    setTimeout(() => {
        notification.classList.remove('opacity-0', 'translate-y-4');
    }, 10);
    
    // 自动关闭
    setTimeout(() => {
        notification.classList.add('opacity-0', 'translate-y-4');
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

/**
 * HTML转义防止XSS
 */
function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// 暴露全局函数
window.showAppointmentModal = showAppointmentModal;
window.closeAppointmentModal = closeAppointmentModal;
window.toggleFaq = toggleFaq;
window.showNotification = showNotification;

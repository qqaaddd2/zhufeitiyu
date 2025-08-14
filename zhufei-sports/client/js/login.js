/**
 * 登录页面脚本
 * 负责管理员登录验证和表单处理
 */
document.addEventListener('DOMContentLoaded', () => {
    // 初始化API基础路径
    window.API_BASE_URL = '/api';
    
    // 检查是否已登录
    checkLoggedIn();
    
    // 初始化登录表单
    initLoginForm();
    
    // 初始化通知系统
    initNotificationSystem();
});

/**
 * 检查是否已登录
 */
function checkLoggedIn() {
    const token = localStorage.getItem('token');
    if (token) {
        // 已登录，跳转到后台首页
        window.location.href = '/admin/index.html';
    }
}

/**
 * 初始化登录表单
 */
function initLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;
    
    // 密码显示/隐藏切换
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // 切换图标
            const icon = togglePassword.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    }
    
    // 表单提交处理
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;
        
        // 表单验证
        if (!username) {
            showNotification('请输入用户名', 'warning');
            return;
        }
        
        if (!password) {
            showNotification('请输入密码', 'warning');
            return;
        }
        
        try {
            // 显示加载状态
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa fa-spinner fa-spin mr-2"></i> 登录中...';
            
            // 发送登录请求
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    password,
                    remember
                })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || '登录失败，请检查用户名和密码');
            }
            
            // 保存登录状态
            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                // 登录成功，跳转到后台首页
                showNotification('登录成功，正在进入系统...', 'success');
                setTimeout(() => {
                    window.location.href = '/admin/index.html';
                }, 1000);
            }
        } catch (error) {
            console.error('登录错误:', error);
            showNotification(error.message || '登录失败，请稍后重试', 'error');
        } finally {
            // 恢复按钮状态
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    });
    
    // 忘记密码链接
    const forgotPasswordLink = document.querySelector('.forgot-password');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            showNotification('请联系系统管理员重置密码', 'info');
        });
    }
}

/**
 * 初始化通知系统
 */
function initNotificationSystem() {
    // 创建通知容器
    let notificationContainer = document.getElementById('notificationContainer');
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notificationContainer';
        notificationContainer.className = 'fixed top-4 right-4 z-50 flex flex-col gap-3';
        document.body.appendChild(notificationContainer);
    }
}

/**
 * 显示通知提示
 */
function showNotification(message, type = 'success', duration = 3000) {
    const notificationContainer = document.getElementById('notificationContainer');
    if (!notificationContainer) {
        initNotificationSystem();
        return;
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

// 暴露全局函数
window.showNotification = showNotification;

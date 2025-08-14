/**
 * 管理员后台公共脚本
 * 负责后台页面认证、导航和公共功能
 */
document.addEventListener('DOMContentLoaded', async () => {
    // 初始化API基础路径
    window.API_BASE_URL = '/api';
    
    // 检查登录状态
    const isAuthenticated = await checkAuthStatus();
    if (!isAuthenticated) {
        window.location.href = '/admin/login.html';
        return;
    }
    
    // 初始化页面
    initAdminPage();
    
    // 加载用户信息
    loadUserInfo();
    
    // 初始化侧边栏导航
    initSidebar();
    
    // 初始化通知系统
    initNotificationSystem();
});

/**
 * 检查认证状态
 */
async function checkAuthStatus() {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/check-token`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return false;
        }
        
        return true;
    } catch (error) {
        console.error('认证检查失败:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return false;
    }
}

/**
 * 初始化管理员页面
 */
function initAdminPage() {
    // 根据当前页面路径激活侧边栏菜单
    const currentPath = window.location.pathname;
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    
    sidebarLinks.forEach(link => {
        const linkPath = new URL(link.href).pathname;
        if (currentPath === linkPath || currentPath.startsWith(linkPath.replace('index.html', ''))) {
            link.classList.add('bg-gray-700', 'text-white');
            link.classList.remove('text-gray-300', 'hover:bg-gray-700', 'hover:text-white');
        }
    });
    
    // 初始化数据统计卡片动画
    initStatCardsAnimation();
}

/**
 * 加载用户信息
 */
function loadUserInfo() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;
    
    const userInfoElement = document.querySelector('.user-info');
    if (userInfoElement) {
        userInfoElement.innerHTML = `
            <div class="font-medium">${user.username}</div>
            <div class="text-xs text-gray-400">${user.role || '管理员'}</div>
        `;
    }
    
    // 设置登出按钮事件
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

/**
 * 处理登出
 */
async function handleLogout() {
    const token = localStorage.getItem('token');
    if (!token) {
        localStorage.removeItem('user');
        window.location.href = '/admin/login.html';
        return;
    }
    
    try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('登出请求失败:', error);
    } finally {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/admin/login.html';
    }
}

/**
 * 初始化侧边栏
 */
function initSidebar() {
    // 侧边栏切换按钮
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('-translate-x-full');
        });
    }
    
    // 侧边栏折叠菜单
    const collapseToggles = document.querySelectorAll('.sidebar-collapse-toggle');
    collapseToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            const parent = toggle.closest('.sidebar-item');
            const collapseMenu = parent.querySelector('.sidebar-collapse');
            
            if (collapseMenu) {
                collapseMenu.classList.toggle('hidden');
                toggle.querySelector('i').classList.toggle('rotate-90');
            }
        });
    });
}

/**
 * 初始化数据统计卡片动画
 */
function initStatCardsAnimation() {
    const statCards = document.querySelectorAll('.stat-card');
    if (statCards.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate-fade-in-up');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    statCards.forEach(card => {
        observer.observe(card);
    });
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
 * 显示通知
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

/**
 * 通用API请求函数
 */
async function apiRequest(endpoint, method = 'GET', data = null, isFormData = false) {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/admin/login.html';
        return Promise.reject(new Error('未登录'));
    }
    
    const options = {
        method,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
    
    // 不设置Content-Type，让浏览器自动处理（适用于FormData）
    if (!isFormData) {
        options.headers['Content-Type'] = 'application/json';
    }
    
    if (data) {
        options.body = isFormData ? data : JSON.stringify(data);
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        const responseData = await response.json();
        
        if (!response.ok) {
            throw new Error(responseData.message || `请求失败: ${response.status}`);
        }
        
        return responseData;
    } catch (error) {
        console.error(`API请求失败 (${endpoint}):`, error);
        showNotification(error.message || '操作失败，请重试', 'error');
        throw error;
    }
}

/**
 * 初始化数据表格
 */
function initDataTable(tableId, options = {}) {
    const table = document.getElementById(tableId);
    if (!table) return;
    
    // 默认配置
    const config = {
        perPage: options.perPage || 10,
        currentPage: 1,
        searchable: options.searchable !== undefined ? options.searchable : true,
        sortable: options.sortable !== undefined ? options.sortable : true
    };
    
    // 初始化搜索功能
    if (config.searchable && options.searchSelector) {
        const searchInput = document.querySelector(options.searchSelector);
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                filterTable(table, searchTerm);
            });
        }
    }
    
    // 初始化排序功能
    if (config.sortable) {
        const headers = table.querySelectorAll('th');
        headers.forEach((header, index) => {
            header.addEventListener('click', () => {
                sortTable(table, index);
            });
        });
    }
    
    // 初始化分页
    if (options.paginationSelector) {
        renderPagination(options.paginationSelector, 1, 10, config.perPage);
    }
    
    return {
        config,
        refresh: () => { /* 刷新表格数据的方法 */ }
    };
}

/**
 * 表格过滤功能
 */
function filterTable(table, searchTerm) {
    const rows = table.querySelectorAll('tbody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

/**
 * 表格排序功能
 */
function sortTable(table, columnIndex) {
    const rows = Array.from(table.querySelectorAll('tbody tr'));
    const header = table.querySelectorAll('th')[columnIndex];
    const isAscending = header.getAttribute('data-sort') !== 'asc';
    
    // 移除所有排序标记
    table.querySelectorAll('th').forEach(th => {
        th.removeAttribute('data-sort');
        th.querySelector('.sort-icon')?.remove();
    });
    
    // 添加当前排序标记
    header.setAttribute('data-sort', isAscending ? 'asc' : 'desc');
    header.innerHTML += isAscending ? ' <i class="fa fa-sort-amount-asc sort-icon"></i>' : ' <i class="fa fa-sort-amount-desc sort-icon"></i>';
    
    // 排序行
    rows.sort((a, b) => {
        const aVal = a.querySelectorAll('td')[columnIndex].textContent.trim();
        const bVal = b.querySelectorAll('td')[columnIndex].textContent.trim();
        
        // 数字比较
        if (!isNaN(aVal) && !isNaN(bVal)) {
            return isAscending ? aVal - bVal : bVal - aVal;
        }
        
        // 字符串比较
        return isAscending ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });
    
    // 重新添加行
    const tbody = table.querySelector('tbody');
    tbody.innerHTML = '';
    rows.forEach(row => tbody.appendChild(row));
}

/**
 * 渲染分页控件
 */
function renderPagination(containerSelector, currentPage, totalItems, perPage) {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    
    const totalPages = Math.ceil(totalItems / perPage);
    let html = '';
    
    // 上一页
    html += `<button class="px-3 py-1 rounded border ${currentPage === 1 ? 'border-gray-200 text-gray-400 cursor-not-allowed' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}" 
                   onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
               <i class="fa fa-chevron-left"></i>
             </button>`;
    
    // 页码
    for (let i = 1; i <= totalPages; i++) {
        // 只显示当前页附近的页码
        if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) {
            html += `<button class="px-3 py-1 rounded border ${i === currentPage ? 'border-primary bg-primary text-white' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}" 
                           onclick="changePage(${i})">${i}</button>`;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            html += `<span class="px-3 py-1">...</span>`;
        }
    }
    
    // 下一页
    html += `<button class="px-3 py-1 rounded border ${currentPage === totalPages ? 'border-gray-200 text-gray-400 cursor-not-allowed' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}" 
                   onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
               <i class="fa fa-chevron-right"></i>
             </button>`;
    
    container.innerHTML = html;
    
    // 更新分页信息
    const startItem = (currentPage - 1) * perPage + 1;
    const endItem = Math.min(currentPage * perPage, totalItems);
    
    document.getElementById('pagination-start')?.setAttribute('textContent', startItem);
    document.getElementById('pagination-end')?.setAttribute('textContent', endItem);
    document.getElementById('pagination-total')?.setAttribute('textContent', totalItems);
}

/**
 * 切换分页
 */
function changePage(page) {
    // 由具体页面实现此函数
    console.log('切换到页面:', page);
}

/**
 * 显示确认对话框
 */
function showConfirmDialog(message, confirmCallback, cancelCallback) {
    // 检查是否已存在对话框
    let dialog = document.getElementById('confirmDialog');
    if (dialog) {
        dialog.remove();
    }
    
    // 创建对话框
    dialog = document.createElement('div');
    dialog.id = 'confirmDialog';
    dialog.className = 'fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4';
    dialog.innerHTML = `
        <div class="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div class="p-6">
                <div class="text-center mb-4">
                    <div class="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fa fa-question-circle text-yellow-500 text-2xl"></i>
                    </div>
                    <h3 class="text-xl font-bold">确认操作</h3>
                    <p class="text-gray-600 mt-2">${message}</p>
                </div>
                
                <div class="flex justify-center gap-3">
                    <button id="cancelConfirmBtn" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
                        取消
                    </button>
                    <button id="confirmConfirmBtn" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition">
                        确认
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(dialog);
    
    // 添加事件监听
    dialog.getElementById('confirmConfirmBtn').addEventListener('click', () => {
        dialog.remove();
        if (typeof confirmCallback === 'function') {
            confirmCallback();
        }
    });
    
    dialog.getElementById('cancelConfirmBtn').addEventListener('click', () => {
        dialog.remove();
        if (typeof cancelCallback === 'function') {
            cancelCallback();
        }
    });
}

// 暴露全局函数
window.showNotification = showNotification;
window.apiRequest = apiRequest;
window.initDataTable = initDataTable;
window.changePage = changePage;
window.showConfirmDialog = showConfirmDialog;

// ============================================
// ADMIN.JS - Logic trang quản trị
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('admin-app')) return;
    checkAdminAuth();
});

function checkAdminAuth() {
    if (isAdminLoggedIn()) {
        showAdminDashboard();
    } else {
        showLoginForm();
    }
}

function showLoginForm() {
    const app = document.getElementById('admin-app');
    app.innerHTML = `
        <div class="admin-login-wrapper">
            <div class="admin-login-card">
                <div class="login-icon">🔐</div>
                <h2>Đăng Nhập Quản Trị</h2>
                <p>Nhập thông tin để truy cập bảng điều khiển</p>
                <form id="login-form" onsubmit="handleLogin(event)">
                    <div class="form-group">
                        <label for="admin-user">Tên đăng nhập</label>
                        <input type="text" id="admin-user" placeholder="admin" required>
                    </div>
                    <div class="form-group">
                        <label for="admin-pass">Mật khẩu</label>
                        <input type="password" id="admin-pass" placeholder="••••••" required>
                    </div>
                    <button type="submit" class="btn btn-primary btn-full">Đăng Nhập</button>
                </form>
                <p class="login-hint">Mặc định: admin / phucbeti999</p>
            </div>
        </div>
    `;
}

function handleLogin(e) {
    e.preventDefault();
    const user = document.getElementById('admin-user').value;
    const pass = document.getElementById('admin-pass').value;
    if (adminLogin(user, pass)) {
        showToast('Đăng nhập thành công!', 'success');
        showAdminDashboard();
    } else {
        showToast('Sai tên đăng nhập hoặc mật khẩu', 'error');
    }
}

function handleLogout() {
    adminLogout();
    showToast('Đã đăng xuất', 'info');
    showLoginForm();
}

// ---- ADMIN DASHBOARD ----
let adminCurrentTab = 'overview';
let adminFilterDate = '';
let adminFilterStatus = 'all';
let adminSearchQuery = '';

function showAdminDashboard() {
    const app = document.getElementById('admin-app');
    app.innerHTML = `
        <div class="admin-dashboard">
            <div class="admin-sidebar">
                <div class="admin-logo">
                    <span class="logo-icon">🏸</span>
                    <span class="logo-text">Admin Panel</span>
                </div>
                <nav class="admin-nav">
                    <button class="admin-nav-btn active" data-tab="overview" onclick="switchTab('overview')">
                        <span>📊</span> Tổng quan
                    </button>
                    <button class="admin-nav-btn" data-tab="bookings" onclick="switchTab('bookings')">
                        <span>📅</span> Đặt sân
                    </button>
                    <button class="admin-nav-btn" data-tab="courts" onclick="switchTab('courts')">
                        <span>🏸</span> Quản lý sân
                    </button>
                    <button class="admin-nav-btn" data-tab="revenue" onclick="switchTab('revenue')">
                        <span>💰</span> Doanh thu
                    </button>
                </nav>
                <button class="admin-logout-btn" onclick="handleLogout()">
                    <span>🚪</span> Đăng xuất
                </button>
            </div>
            <div class="admin-main">
                <div class="admin-header">
                    <h1 id="admin-page-title">📊 Tổng Quan</h1>
                    <div class="admin-header-actions">
                        <span class="admin-date">${new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                    </div>
                </div>
                <div id="admin-content"></div>
            </div>
        </div>
    `;
    switchTab('overview');
}

function switchTab(tab) {
    adminCurrentTab = tab;
    document.querySelectorAll('.admin-nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`.admin-nav-btn[data-tab="${tab}"]`)?.classList.add('active');

    const titles = { overview: '📊 Tổng Quan', bookings: '📅 Quản Lý Đặt Sân', courts: '🏸 Quản Lý Sân', revenue: '💰 Doanh Thu' };
    document.getElementById('admin-page-title').textContent = titles[tab];

    const content = document.getElementById('admin-content');
    switch (tab) {
        case 'overview': renderOverview(content); break;
        case 'bookings': renderBookingsAdmin(content); break;
        case 'courts': renderCourtsAdmin(content); break;
        case 'revenue': renderRevenue(content); break;
    }
}

// ---- OVERVIEW TAB ----
function renderOverview(container) {
    const stats = getStats();
    // Lấy tất cả đặt sân hoạt động (chưa bị hủy) bao gồm chờ thanh toán và đã thanh toán
    const bookings = getBookings().filter(b => b.status === 'confirmed' || b.status === 'paid');
    const recent = bookings.slice(-5).reverse();

    container.innerHTML = `
        <div class="stats-grid">
            <div class="stat-card stat-primary">
                <div class="stat-icon">📅</div>
                <div class="stat-info">
                    <h3 class="stat-number" data-target="${stats.todayBookings}">${stats.todayBookings}</h3>
                    <p>Đặt sân hôm nay</p>
                </div>
            </div>
            <div class="stat-card stat-success">
                <div class="stat-icon">✅</div>
                <div class="stat-info">
                    <h3 class="stat-number" data-target="${stats.totalBookings}">${stats.totalBookings}</h3>
                    <p>Tổng lượt đặt</p>
                </div>
            </div>
            <div class="stat-card stat-warning">
                <div class="stat-icon">💰</div>
                <div class="stat-info">
                    <h3 class="stat-number">${formatCurrency(stats.todayRevenue)}</h3>
                    <p>Doanh thu hôm nay</p>
                </div>
            </div>
            <div class="stat-card stat-danger">
                <div class="stat-icon">❌</div>
                <div class="stat-info">
                    <h3 class="stat-number" data-target="${stats.cancelledCount}">${stats.cancelledCount}</h3>
                    <p>Đã huỷ</p>
                </div>
            </div>
        </div>

        <div class="admin-panels">
            <div class="admin-panel">
                <h3 class="panel-title">🕐 Đặt sân gần đây</h3>
                ${recent.length > 0 ? `
                    <div class="recent-list">
                        ${recent.map(b => `
                            <div class="recent-item">
                                <div class="recent-avatar">${b.customerName?.charAt(0) || '?'}</div>
                                <div class="recent-info">
                                    <strong>${b.customerName}</strong>
                                    <span>${b.courtName} • ${b.time} • ${formatDate(b.date)}</span>
                                </div>
                                <div class="recent-price">${formatCurrency(b.price)}</div>
                            </div>
                        `).join('')}
                    </div>
                ` : '<p class="empty-state">Chưa có đặt sân nào</p>'}
            </div>
            <div class="admin-panel">
                <h3 class="panel-title">📊 Tỉ lệ sân</h3>
                <div class="court-usage-list">
                    ${COURTS.map(court => {
        const courtBookings = bookings.filter(b => b.courtId === court.id).length;
        const pct = stats.totalBookings > 0 ? Math.round(courtBookings / stats.totalBookings * 100) : 0;
        return `
                            <div class="usage-item">
                                <div class="usage-label">
                                    <span>${court.image} ${court.name}</span>
                                    <span>${courtBookings} lượt (${pct}%)</span>
                                </div>
                                <div class="usage-bar"><div class="usage-fill" style="width:${pct}%"></div></div>
                            </div>
                        `;
    }).join('')}
                </div>
            </div>
        </div>
    `;
}

// ---- BOOKINGS TAB ----
function renderBookingsAdmin(container) {
    let bookings = getBookings().slice().reverse();

    // Filters
    if (adminFilterDate) bookings = bookings.filter(b => b.date === adminFilterDate);
    if (adminFilterStatus !== 'all') bookings = bookings.filter(b => b.status === adminFilterStatus);
    if (adminSearchQuery) {
        const q = adminSearchQuery.toLowerCase();
        bookings = bookings.filter(b =>
            b.customerName?.toLowerCase().includes(q) ||
            b.customerPhone?.includes(q) ||
            b.courtName?.toLowerCase().includes(q)
        );
    }

    container.innerHTML = `
        <div class="admin-filters">
            <div class="filter-group">
                <input type="text" id="admin-search" class="filter-input" placeholder="🔍 Tìm tên, SĐT, sân..." 
                    value="${adminSearchQuery}" oninput="adminSearchQuery=this.value; renderBookingsAdmin(document.getElementById('admin-content'))">
            </div>
            <div class="filter-group">
                <input type="date" id="admin-filter-date" class="filter-input" value="${adminFilterDate}" 
                    onchange="adminFilterDate=this.value; renderBookingsAdmin(document.getElementById('admin-content'))">
            </div>
            <div class="filter-group">
                <select id="admin-filter-status" class="filter-input" 
                    onchange="adminFilterStatus=this.value; renderBookingsAdmin(document.getElementById('admin-content'))">
                    <option value="all" ${adminFilterStatus === 'all' ? 'selected' : ''}>Tất cả trạng thái</option>
                    <option value="confirmed" ${adminFilterStatus === 'confirmed' ? 'selected' : ''}>⏳ Chờ thanh toán</option>
                    <option value="paid" ${adminFilterStatus === 'paid' ? 'selected' : ''}>💰 Đã thanh toán</option>
                    <option value="cancelled" ${adminFilterStatus === 'cancelled' ? 'selected' : ''}>❌ Đã huỷ</option>
                </select>
            </div>
            <button class="btn btn-outline" onclick="adminFilterDate=''; adminFilterStatus='all'; adminSearchQuery=''; renderBookingsAdmin(document.getElementById('admin-content'))">Xoá bộ lọc</button>
        </div>

        <div class="bookings-count">Hiển thị <strong>${bookings.length}</strong> kết quả</div>

        ${bookings.length > 0 ? `
            <div class="admin-table-wrapper">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Khách hàng</th>
                            <th>SĐT</th>
                            <th>Sân</th>
                            <th>Ngày</th>
                            <th>Giờ</th>
                            <th>Giá</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${bookings.map(b => `
                            <tr class="booking-row ${b.status}">
                                <td><code>${b.id?.substring(0, 8)}</code></td>
                                <td><strong>${b.customerName || 'N/A'}</strong></td>
                                <td>${b.customerPhone || 'N/A'}</td>
                                <td><span class="court-badge badge-${b.courtType}">${b.courtName}</span></td>
                                <td>${formatDate(b.date)}</td>
                                <td>${b.time}</td>
                                <td class="price-cell">${formatCurrency(b.price)}</td>
                                <td>
                                    <span class="status-badge status-${b.status}">
                                        ${b.status === 'confirmed' ? '⏳ Chờ thanh toán' : b.status === 'paid' ? '💰 Đã thanh toán' : '❌ Đã huỷ'}
                                    </span>
                                </td>
                                <td class="action-cell">
                                    ${b.status === 'confirmed' ? `
                                        <button class="btn-action btn-approve" onclick="adminApproveBooking('${b.id}')">Duyệt</button>
                                        <button class="btn-action btn-cancel" onclick="adminCancelBooking('${b.id}')">Huỷ</button>
                                    ` : (b.status === 'paid' ? `
                                        <button class="btn-action btn-cancel" onclick="adminCancelBooking('${b.id}')">Huỷ</button>
                                    ` : '')}
                                    <button class="btn-action btn-delete" onclick="adminDeleteBooking('${b.id}')">Xoá</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        ` : '<div class="empty-state"><p>🔍 Không tìm thấy kết quả</p></div>'}
    `;
}

function adminCancelBooking(id) {
    if (confirm('Bạn có chắc muốn huỷ đặt sân này?')) {
        cancelBooking(id);
        showToast('Đã huỷ đặt sân', 'info');
        switchTab('bookings');
    }
}

function adminApproveBooking(id) {
    if (confirm('Xác nhận đã nhận được tiền và phê duyệt lịch đặt này?')) {
        const bookings = getBookings();
        bookings.forEach(b => {
            if (b.id === id) {
                b.status = 'paid';
            }
        });
        saveBookings(bookings);
        showToast('Đã phê duyệt thanh toán đặt sân! 💰', 'success');
        switchTab('bookings');
    }
}

function adminDeleteBooking(id) {
    if (confirm('Xoá vĩnh viễn đặt sân này?')) {
        deleteBooking(id);
        showToast('Đã xoá đặt sân', 'success');
        switchTab('bookings');
    }
}

// ---- COURTS TAB ----
function renderCourtsAdmin(container) {
    const bookings = getBookings().filter(b => b.status === 'confirmed');

    container.innerHTML = `
        <div class="courts-grid-admin">
            ${COURTS.map(court => {
        const courtBookings = bookings.filter(b => b.courtId === court.id);
        const revenue = courtBookings.reduce((s, b) => s + (b.price || 0), 0);
        const todaySlots = TIME_SLOTS.filter(t => isSlotBooked(court.id, getTodayStr(), t)).length;

        return `
                    <div class="court-card-admin">
                        <div class="court-card-header type-${court.type}">
                            <span class="court-card-icon">${court.image}</span>
                            <h3>${court.name}</h3>
                            <span class="court-type-badge">${court.type.toUpperCase()}</span>
                        </div>
                        <div class="court-card-body">
                            <p class="court-desc">${court.description}</p>
                            <div class="court-stats-mini">
                                <div class="mini-stat">
                                    <span class="mini-value">${courtBookings.length}</span>
                                    <span class="mini-label">Tổng lượt đặt</span>
                                </div>
                                <div class="mini-stat">
                                    <span class="mini-value">${todaySlots}/${TIME_SLOTS.length}</span>
                                    <span class="mini-label">Slot hôm nay</span>
                                </div>
                                <div class="mini-stat">
                                    <span class="mini-value">${formatCurrency(revenue)}</span>
                                    <span class="mini-label">Doanh thu</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
    }).join('')}
        </div>
    `;
}

// ---- REVENUE TAB ----
function renderRevenue(container) {
    const bookings = getBookings().filter(b => b.status === 'confirmed');
    const totalRevenue = bookings.reduce((s, b) => s + (b.price || 0), 0);

    // Revenue by court type
    const byType = {};
    bookings.forEach(b => {
        if (!byType[b.courtType]) byType[b.courtType] = 0;
        byType[b.courtType] += b.price || 0;
    });

    // Revenue by date (last 7 days)
    const last7 = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const dayBookings = bookings.filter(b => b.date === dateStr);
        const dayRevenue = dayBookings.reduce((s, b) => s + (b.price || 0), 0);
        last7.push({ date: dateStr, label: d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }), revenue: dayRevenue, count: dayBookings.length });
    }
    const maxRev = Math.max(...last7.map(d => d.revenue), 1);

    container.innerHTML = `
        <div class="revenue-summary">
            <div class="revenue-total-card">
                <h2>Tổng Doanh Thu</h2>
                <div class="revenue-amount">${formatCurrency(totalRevenue)}</div>
                <p>${bookings.length} lượt đặt thành công</p>
            </div>
        </div>

        <div class="admin-panels">
            <div class="admin-panel">
                <h3 class="panel-title">📈 Doanh thu 7 ngày gần đây</h3>
                <div class="chart-bar">
                    ${last7.map(d => `
                        <div class="chart-col">
                            <div class="chart-value">${d.revenue > 0 ? formatCurrency(d.revenue) : '-'}</div>
                            <div class="chart-bar-fill" style="height: ${Math.max(d.revenue / maxRev * 150, 4)}px"></div>
                            <div class="chart-label">${d.label}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="admin-panel">
                <h3 class="panel-title">🏷️ Doanh thu theo loại sân</h3>
                <div class="revenue-by-type">
                    ${Object.entries(byType).map(([type, rev]) => `
                        <div class="type-revenue-item">
                            <span class="court-badge badge-${type}">${type.toUpperCase()}</span>
                            <div class="type-revenue-bar">
                                <div class="type-fill type-fill-${type}" style="width: ${totalRevenue > 0 ? rev / totalRevenue * 100 : 0}%"></div>
                            </div>
                            <span class="type-revenue-value">${formatCurrency(rev)}</span>
                        </div>
                    `).join('')}
                    ${Object.keys(byType).length === 0 ? '<p class="empty-state">Chưa có dữ liệu</p>' : ''}
                </div>
            </div>
        </div>
    `;
}

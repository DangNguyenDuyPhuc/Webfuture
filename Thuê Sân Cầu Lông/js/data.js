// ============================================
// DATA LAYER - Dữ liệu sân cầu lông
// ============================================

const COURTS = [
    { id: 1, name: 'Sân 1', type: 'premium', description: 'Sân tiêu chuẩn thi đấu, sàn gỗ cao cấp', image: '🏸' },
    { id: 2, name: 'Sân 2', type: 'premium', description: 'Sân tiêu chuẩn thi đấu, sàn gỗ cao cấp', image: '🏸' },
    { id: 3, name: 'Sân 3', type: 'standard', description: 'Sân tập luyện, sàn PVC chống trượt', image: '🏸' },
    { id: 4, name: 'Sân 4', type: 'standard', description: 'Sân tập luyện, sàn PVC chống trượt', image: '🏸' },
    { id: 5, name: 'Sân 5', type: 'standard', description: 'Sân tập luyện, sàn PVC chống trượt', image: '🏸' },
    { id: 6, name: 'Sân 6', type: 'vip', description: 'Sân VIP, máy lạnh, sàn gỗ nhập khẩu', image: '⭐' },
];

const TIME_SLOTS = [
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00'
];

const PRICING = {
    standard: {
        morning: { time: '06:00 - 11:00', price: 80000, label: 'Sáng' },
        afternoon: { time: '11:00 - 17:00', price: 100000, label: 'Chiều' },
        evening: { time: '17:00 - 22:00', price: 150000, label: 'Tối' },
    },
    premium: {
        morning: { time: '06:00 - 11:00', price: 120000, label: 'Sáng' },
        afternoon: { time: '11:00 - 17:00', price: 150000, label: 'Chiều' },
        evening: { time: '17:00 - 22:00', price: 200000, label: 'Tối' },
    },
    vip: {
        morning: { time: '06:00 - 11:00', price: 180000, label: 'Sáng' },
        afternoon: { time: '11:00 - 17:00', price: 220000, label: 'Chiều' },
        evening: { time: '17:00 - 22:00', price: 280000, label: 'Tối' },
    }
};

const PACKAGES = [
    { name: 'Gói Tháng Sáng', sessions: 30, discount: 20, period: 'morning', type: 'standard' },
    { name: 'Gói Tháng Tối', sessions: 30, discount: 15, period: 'evening', type: 'standard' },
    { name: 'Gói Tuần Premium', sessions: 7, discount: 10, period: 'all', type: 'premium' },
    { name: 'Gói VIP Tháng', sessions: 30, discount: 25, period: 'all', type: 'vip' },
];

// ============================================
// BOOKING STORAGE (LocalStorage)
// ============================================
const STORAGE_KEY = 'badminton_bookings';
const ADMIN_KEY = 'badminton_admin';

function getBookings() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

function saveBookings(bookings) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

function addBooking(booking) {
    const bookings = getBookings();
    booking.id = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    booking.createdAt = new Date().toISOString();
    booking.status = 'confirmed';
    bookings.push(booking);
    saveBookings(bookings);
    return booking;
}

function cancelBooking(id) {
    const bookings = getBookings();
    const idx = bookings.findIndex(b => b.id === id);
    if (idx !== -1) {
        bookings[idx].status = 'cancelled';
        saveBookings(bookings);
        return true;
    }
    return false;
}

function deleteBooking(id) {
    let bookings = getBookings();
    bookings = bookings.filter(b => b.id !== id);
    saveBookings(bookings);
}

function isSlotBooked(courtId, date, time) {
    const bookings = getBookings();
    return bookings.some(b =>
        b.courtId === courtId &&
        b.date === date &&
        b.time === time &&
        (b.status === 'confirmed' || b.status === 'paid')
    );
}

function getPrice(courtType, timeStr) {
    const hour = parseInt(timeStr.split(':')[0]);
    let period = 'morning';
    if (hour >= 11 && hour < 17) period = 'afternoon';
    else if (hour >= 17) period = 'evening';
    return PRICING[courtType]?.[period]?.price || 0;
}

function getPeriodLabel(timeStr) {
    const hour = parseInt(timeStr.split(':')[0]);
    if (hour < 11) return 'Sáng';
    if (hour < 17) return 'Chiều';
    return 'Tối';
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
}

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });
}

function getTodayStr() {
    const d = new Date();
    return d.toISOString().split('T')[0];
}

// Admin authentication (simple)
function isAdminLoggedIn() {
    return sessionStorage.getItem('admin_logged_in') === 'true';
}

function adminLogin(username, password) {
    // Default admin credentials
    if (username === 'admin' && password === 'phucbeti999') {
        sessionStorage.setItem('admin_logged_in', 'true');
        return true;
    }
    return false;
}

function adminLogout() {
    sessionStorage.removeItem('admin_logged_in');
}

// Stats for admin
function getStats() {
    const bookings = getBookings();
    const today = getTodayStr();
    // Cả trạng thái 'confirmed' và 'paid' đều tính vào doanh thu và đặt lịch thành công
    const activeBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'paid');
    const todayBookings = activeBookings.filter(b => b.date === today);
    const totalRevenue = activeBookings.reduce((sum, b) => sum + (b.price || 0), 0);
    const todayRevenue = todayBookings.reduce((sum, b) => sum + (b.price || 0), 0);

    return {
        totalBookings: activeBookings.length,
        todayBookings: todayBookings.length,
        totalRevenue,
        todayRevenue,
        cancelledCount: bookings.filter(b => b.status === 'cancelled').length,
    };
}

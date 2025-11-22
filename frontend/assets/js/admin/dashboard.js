(() => {
const { apiRequest, formatPrice, formatDateTime, isLoggedIn, getUserData, logout } = window.TourBooking || {};

// Check admin permission
function checkAdminAccess() {
    if (!isLoggedIn()) {
        window.location.href = '../login.html';
        return false;
    }

    const user = getUserData();
    if (user.role !== 'admin') {
        alert('Bạn không có quyền truy cập trang này');
        window.location.href = '../index.html';
        return false;
    }

    // Display admin info
    document.getElementById('adminName').textContent = user.full_name || 'Admin';
    document.getElementById('adminEmail').textContent = user.email;
    
    return true;
}

async function loadDashboardStats() {
    try {
        // Load admin stats
        const [statsRes, bookingsRes] = await Promise.all([
            apiRequest('/admin/stats'),
            apiRequest('/admin/bookings?limit=10')
        ]);

        // Update stats from admin endpoint
        if (statsRes.success) {
            const { bookings, users, tours } = statsRes.data;
            
            document.getElementById('totalBookings').textContent = bookings.total_bookings;
            document.getElementById('totalUsers').textContent = users.total_users;
            document.getElementById('totalTours').textContent = tours.total_tours;
            document.getElementById('totalRevenue').textContent = formatPrice(bookings.total_revenue || 0);
        }

        // Display recent bookings
        if (bookingsRes.success && bookingsRes.data.bookings) {
            renderRecentBookings(bookingsRes.data.bookings);
        }

    } catch (error) {
        console.error('Load stats error:', error);
        // Show error message
        document.getElementById('totalBookings').textContent = 'Error';
        document.getElementById('totalUsers').textContent = 'Error';
        document.getElementById('totalTours').textContent = 'Error';
    }
}

function renderRecentBookings(bookings) {
    const tbody = document.getElementById('recentBookings');
    
    if (bookings.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">Chưa có booking nào</td></tr>';
        return;
    }

    tbody.innerHTML = bookings.map(booking => `
        <tr>
            <td><strong>${booking.booking_reference}</strong></td>
            <td>${booking.contact_name}</td>
            <td>${booking.tour_title}</td>
            <td>${formatPrice(booking.final_price)}</td>
            <td><span class="status-badge status-${booking.status}">${booking.status}</span></td>
            <td>${formatDateTime(booking.booking_date)}</td>
        </tr>
    `).join('');
}

// Logout handler
document.getElementById('btnLogout')?.addEventListener('click', () => {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
        logout();
    }
});

// Init
document.addEventListener('DOMContentLoaded', () => {
    if (checkAdminAccess()) {
        loadDashboardStats();
    }
});
})();

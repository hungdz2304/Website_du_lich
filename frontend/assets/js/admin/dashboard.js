(() => {
const { apiRequest, formatPrice, formatDateTime, isLoggedIn, getUserData, logout } = window.TourBooking || {};
let chartInstance = null;
let chartData = { labels: [], lineData: [], pieData: { labels: [], values: [] } };

function checkAdminAccess() {
    if (!isLoggedIn()) {
        window.location.href = '../login.html';
        return false;
    }
    const user = getUserData();
    if (!user || user.role !== 'admin') {
        alert('Bạn không có quyền truy cập trang này');
        window.location.href = '../index.html';
        return false;
    }
    document.getElementById('adminName').textContent = user.full_name || 'Admin';
    document.getElementById('adminEmail').textContent = user.email;
    return true;
}

async function loadDashboardStats() {
    try {
        const [statsRes, bookingsRes] = await Promise.all([
            apiRequest('/admin/stats'),
            apiRequest('/admin/bookings?limit=20')
        ]);

        if (statsRes.success) {
            const { bookings, users, tours } = statsRes.data;
            document.getElementById('totalBookings').textContent = bookings.total_bookings;
            document.getElementById('totalUsers').textContent = users.total_users;
            document.getElementById('totalTours').textContent = tours.total_tours;
            document.getElementById('totalRevenue').textContent = formatPrice(bookings.total_revenue || 0);
        }

        if (bookingsRes.success && bookingsRes.data.bookings) {
            renderRecentBookings(bookingsRes.data.bookings);
            buildChartData(bookingsRes.data.bookings);
            renderChart(document.getElementById('chartType')?.value || 'line');
        }
    } catch (error) {
        console.error('Load stats error:', error);
        document.getElementById('totalBookings').textContent = 'Error';
        document.getElementById('totalUsers').textContent = 'Error';
        document.getElementById('totalTours').textContent = 'Error';
    }
}

function renderRecentBookings(bookings) {
    const tbody = document.getElementById('recentBookings');
    if (!tbody) return;
    if (bookings.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">Chưa có booking nào</td></tr>';
        return;
    }
    tbody.innerHTML = bookings.map(b => `
        <tr>
            <td><strong>${b.booking_reference}</strong></td>
            <td>${b.contact_name}</td>
            <td>${b.tour_title}</td>
            <td>${formatPrice(b.final_price)}</td>
            <td><span class="status-badge status-${b.status}">${b.status}</span></td>
            <td>${formatDateTime(b.booking_date)}</td>
        </tr>
    `).join('');
}

function buildChartData(bookings) {
    const statusCounts = bookings.reduce((acc, b) => {
        acc[b.status] = (acc[b.status] || 0) + 1;
        return acc;
    }, {});

    const daily = {};
    bookings.forEach(b => {
        const day = (b.booking_date || '').slice(0, 10);
        if (!day) return;
        daily[day] = (daily[day] || 0) + 1;
    });
    const dailyLabels = Object.keys(daily).sort();

    chartData = {
        labels: dailyLabels.length ? dailyLabels : ['N/A'],
        lineData: dailyLabels.length ? dailyLabels.map(d => daily[d]) : [0],
        pieData: {
            labels: Object.keys(statusCounts).length ? Object.keys(statusCounts) : ['N/A'],
            values: Object.keys(statusCounts).length ? Object.values(statusCounts) : [1]
        }
    };
}

function renderChart(type = 'line') {
    const ctx = document.getElementById('adminChart');
    if (!ctx || typeof Chart === 'undefined') return;
    if (chartInstance) chartInstance.destroy();

    const palette = ['#ff7f50', '#36a2eb', '#4bc0c0', '#9966ff', '#ffcd56'];

    if (type === 'pie') {
        chartInstance = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: chartData.pieData.labels,
                datasets: [{
                    data: chartData.pieData.values,
                    backgroundColor: palette
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 1,
                layout: { padding: 10 }
            }
        });
        return;
    }

    const isArea = type === 'area';
    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartData.labels,
            datasets: [{
                label: 'Bookings',
                data: chartData.lineData,
                borderColor: '#ff7f50',
                backgroundColor: isArea ? 'rgba(255,127,80,0.25)' : 'transparent',
                fill: isArea,
                tension: 0.3,
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2,
            layout: { padding: 10 },
            plugins: { legend: { display: !isArea } },
            scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
        }
    });
}

document.getElementById('btnLogout')?.addEventListener('click', () => {
    if (confirm('Bạn chắc chắn muốn đăng xuất?')) logout();
});

document.getElementById('chartType')?.addEventListener('change', (e) => {
    renderChart(e.target.value);
});

document.addEventListener('DOMContentLoaded', () => {
    if (checkAdminAccess()) {
        loadDashboardStats();
    }
});
})();

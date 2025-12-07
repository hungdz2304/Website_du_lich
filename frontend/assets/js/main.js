// ===========================================
// Main JavaScript - Global Utilities
// ===========================================

// API Configuration
const API_URL = 'http://localhost:3000/api';
const API_BASE = API_URL.replace(/\/api$/, '');

// Curated Unsplash fallbacks ensure consistent imagery when DB URLs are missing
const IMAGE_FALLBACKS = {
    destination: {
        default: 'https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=900&q=60',
        'phu-quoc': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=60',
        'da-lat': 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=60',
        'nha-trang': 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=900&q=60',
        'ha-long': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=60',
        'sapa': 'https://images.unsplash.com/photo-1500631195312-e3a9d1e4c8b7?auto=format&fit=crop&w=900&q=60',
        'hoi-an': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=60',
        'da-nang': 'https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?auto=format&fit=crop&w=900&q=60',
        'quy-nhon': 'https://images.unsplash.com/photo-1526779259212-939e64782fd0?auto=format&fit=crop&w=900&q=60'
    },
    tour: {
        default: `${API_BASE}/uploads/tours/thumb/phu-quoc.jpg`,
        'tour-phu-quoc-3n2d-vinwonders': `${API_BASE}/uploads/tours/thumb/phu-quoc.jpg`,
        'tour-da-lat-3n2d-thien-vien': `${API_BASE}/uploads/tours/thumb/da-lat.jpg`,
        'tour-nha-trang-3n3d-4-dao': `${API_BASE}/uploads/tours/thumb/nha-trang.jpg`,
        'tour-ha-long-2n1d-du-thuyen': `${API_BASE}/uploads/tours/thumb/ha-long.jpg`,
        'tour-sapa-3n2d-fansipan': `${API_BASE}/uploads/tours/thumb/sapa.jpg`,
        'tour-hoi-an-da-nang-4n3d': `${API_BASE}/uploads/tours/thumb/phu-quoc.jpg`
    }
};

function normalizeMediaPath(url) {
    if (!url) return '';
    let normalized = url.replace(/\\/g, '/');
    if (normalized.startsWith('/uploads')) {
        return `${API_BASE}${normalized}`;
    }
    if (normalized.startsWith('uploads')) {
        return `${API_BASE}/${normalized}`;
    }
    return normalized;
}

function resolveDestinationSlug(target) {
    if (!target) return null;
    if (typeof target === 'string') return target;
    return target.slug || target.destination_slug || null;
}

function getDestinationImage(target) {
    if (!target) {
        return IMAGE_FALLBACKS.destination.default;
    }

    if (typeof target === 'object' && target.image_url) {
        return target.image_url;
    }

    const slug = resolveDestinationSlug(target);
    return (slug && IMAGE_FALLBACKS.destination[slug]) || IMAGE_FALLBACKS.destination.default;
}

function resolveTourSlug(target) {
    if (!target) return null;
    if (typeof target === 'string') return target;
    return target.slug || target.tour_slug || null;
}

function getTourImage(target) {
    if (!target) {
        return IMAGE_FALLBACKS.tour.default;
    }

    if (typeof target === 'object' && target.cover_image_url) {
        const url = target.cover_image_url;
        // Bỏ placeholder example.com, ưu tiên ảnh local và thêm host nếu cần
        if (!/example\.com/i.test(url)) {
            return normalizeMediaPath(url);
        }
    }

    const tourSlug = resolveTourSlug(target);
    if (tourSlug && IMAGE_FALLBACKS.tour[tourSlug]) {
        return IMAGE_FALLBACKS.tour[tourSlug];
    }

    const destinationRef = typeof target === 'object' ? (target.destination_slug || target.destination) : null;
    return getDestinationImage(destinationRef) || IMAGE_FALLBACKS.tour.default;
}

// ===========================================
// Authentication Helpers
// ===========================================

function isLoggedIn() {
    return localStorage.getItem('token') !== null;
}

function getToken() {
    return localStorage.getItem('token');
}

function getUserData() {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
}

function setUserData(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('userData', JSON.stringify(user));
    updateAuthUI();
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    updateAuthUI();
    showToast('Đã đăng xuất thành công', 'info');
    window.location.href = 'index.html';
}

function updateAuthUI() {
    const authLinks = document.getElementById('authLinks');
    const userMenu = document.getElementById('userMenu');
    const userName = document.getElementById('userName');
    const userDropdown = document.getElementById('userDropdown');
    
    if (!authLinks || !userMenu) return;
    
    if (isLoggedIn()) {
        const user = getUserData();
        authLinks.style.display = 'none';
        userMenu.style.display = 'block';
        if (userName) {
            userName.textContent = user.full_name || user.email;
        }
        
        // Add admin link if user is admin
        if (user.role === 'admin' && userDropdown) {
            const existingAdminLink = userDropdown.querySelector('a[href*="admin"]');
            if (!existingAdminLink) {
                const adminLink = document.createElement('a');
                adminLink.href = 'admin/index.html';
                adminLink.innerHTML = '<i class="fas fa-user-shield"></i> Quản trị';
                userDropdown.insertBefore(adminLink, userDropdown.firstChild);
            }
        }
    } else {
        authLinks.style.display = 'flex';
        userMenu.style.display = 'none';
    }
}

// ===========================================
// API Request Helper
// ===========================================

async function apiRequest(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    
    // Add auth token if available
    const token = getToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    try {
        const response = await fetch(url, {
            ...options,
            headers
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// ===========================================
// Utility Functions
// ===========================================

function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(date);
}

function formatDateTime(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = 'block';
    }
}

function hideLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = 'none';
    }
}

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function setQueryParam(param, value) {
    const url = new URL(window.location);
    url.searchParams.set(param, value);
    window.history.pushState({}, '', url);
}

// ===========================================
// Initialize on Page Load
// ===========================================

document.addEventListener('DOMContentLoaded', () => {
    // Update auth UI
    updateAuthUI();
    
    // User dropdown toggle
    const btnUserDropdown = document.getElementById('btnUserDropdown');
    const userDropdown = document.getElementById('userDropdown');
    
    if (btnUserDropdown && userDropdown) {
        btnUserDropdown.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdown.style.display = userDropdown.style.display === 'none' ? 'block' : 'none';
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            userDropdown.style.display = 'none';
        });
    }
    
    // Logout button
    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
        btnLogout.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
});

// ===========================================
// Export for use in other files
// ===========================================

window.TourBooking = {
    API_URL,
    isLoggedIn,
    getToken,
    getUserData,
    setUserData,
    logout,
    apiRequest,
    formatPrice,
    formatDate,
    formatDateTime,
    showToast,
    showLoading,
    hideLoading,
    getQueryParam,
    setQueryParam,
    getDestinationImage,
    getTourImage,
    normalizeMediaPath
};

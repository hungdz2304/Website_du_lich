(() => {
    const {
        apiRequest,
        formatPrice,
        formatDate,
        formatDateTime,
        showToast,
        isLoggedIn
    } = window.TourBooking || {};

    const bookingsState = {
        filterStatus: '',
        searchTerm: '',
        items: [],
        allItems: []
    };

    const ONLINE_PAYMENT_METHODS = ['bank_card', 'momo', 'zalopay', 'vnpay', 'credit_card'];

    const paymentMethodLabels = {
        momo: 'Ví MoMo',
        zalopay: 'Ví ZaloPay',
        vnpay: 'Ví VNPay',
        bank_card: 'Thẻ ATM nội địa',
        credit_card: 'Thẻ Visa/Master',
        bank_transfer: 'Chuyển khoản ngân hàng',
        pay_later: 'Thanh toán tại văn phòng',
        installment: 'Trả góp 0%',
        cash: 'Tiền mặt',
        other: 'Khác'
    };

    const paymentStatusLabels = {
        pending: 'Chưa thanh toán',
        paid: 'Đã thanh toán',
        partial: 'Thanh toán một phần',
        refunded: 'Đã hoàn tiền',
        cancelled: 'Hủy thanh toán'
    };

    const statusLabels = {
        pending: 'Chờ xác nhận',
        confirmed: 'Đã xác nhận',
        completed: 'Hoàn thành',
        cancelled: 'Đã hủy'
    };

    function getElement(id) {
        return document.getElementById(id);
    }

    function getStatusClass(status) {
        switch (status) {
            case 'confirmed':
                return 'status-confirmed';
            case 'completed':
                return 'status-completed';
            case 'cancelled':
                return 'status-cancelled';
            default:
                return 'status-pending';
        }
    }

    function getStatusIcon(status) {
        switch (status) {
            case 'confirmed':
                return 'fa-check-circle';
            case 'completed':
                return 'fa-trophy';
            case 'cancelled':
                return 'fa-times-circle';
            default:
                return 'fa-clock';
        }
    }

    function updateStats() {
        const items = bookingsState.allItems;
        
        const pendingCount = items.filter(b => b.status === 'pending').length;
        const confirmedCount = items.filter(b => b.status === 'confirmed').length;
        const completedCount = items.filter(b => b.status === 'completed').length;
        const totalCount = items.length;

        // Update stat cards
        const pendingEl = getElement('statPending');
        const confirmedEl = getElement('statConfirmed');
        const completedEl = getElement('statCompleted');
        const totalEl = getElement('statTotal');

        if (pendingEl) pendingEl.textContent = pendingCount;
        if (confirmedEl) confirmedEl.textContent = confirmedCount;
        if (completedEl) completedEl.textContent = completedCount;
        if (totalEl) totalEl.textContent = totalCount;
    }

    async function loadBookings() {
        const loading = getElement('loadingBookings');
        const empty = getElement('emptyBookings');
        if (loading) loading.style.display = 'block';
        if (empty) empty.style.display = 'none';

        try {
            // Load all bookings first for stats
            const res = await apiRequest(`/bookings/my-history`);
            if (!res.success) return;
            
            bookingsState.allItems = res.data || [];
            updateStats();

            // Apply filters
            applyFilters();
        } catch (error) {
            console.error('loadBookings error:', error);
            showToast('Không thể tải lịch sử đặt tour', 'error');
        } finally {
            if (loading) loading.style.display = 'none';
        }
    }

    function applyFilters() {
        let filtered = bookingsState.allItems;

        // Apply status filter
        if (bookingsState.filterStatus) {
            filtered = filtered.filter(b => b.status === bookingsState.filterStatus);
        }

        // Apply search filter
        if (bookingsState.searchTerm) {
            const term = bookingsState.searchTerm.toLowerCase();
            filtered = filtered.filter(b => 
                b.booking_reference?.toLowerCase().includes(term) ||
                b.tour_title?.toLowerCase().includes(term) ||
                b.destination_name?.toLowerCase().includes(term)
            );
        }

        bookingsState.items = filtered;
        renderBookings(filtered);

        // Update search result count
        const resultCountEl = getElement('searchResultCount');
        const countEl = getElement('resultCount');
        if (resultCountEl && countEl) {
            if (bookingsState.searchTerm) {
                resultCountEl.style.display = 'block';
                countEl.textContent = filtered.length;
            } else {
                resultCountEl.style.display = 'none';
            }
        }

        // Show/hide clear button
        const clearBtn = getElement('btnClearSearch');
        if (clearBtn) {
            clearBtn.style.display = bookingsState.searchTerm ? 'block' : 'none';
        }
    }

    function renderBookings(bookings) {
        const list = getElement('bookingsList');
        const empty = getElement('emptyBookings');
        if (!list || !empty) return;

        if (!bookings || bookings.length === 0) {
            list.innerHTML = '';
            empty.style.display = 'block';
            return;
        }

        empty.style.display = 'none';
        list.innerHTML = bookings
            .map(booking => {
                const allowCancel = ['pending', 'confirmed'].includes(booking.status);
                const allowReview = booking.status === 'completed';
                const statusLabel = statusLabels[booking.status] || booking.status;
                const statusIcon = getStatusIcon(booking.status);

                return `
                    <article class="booking-card" data-booking-id="${booking.booking_id}">
                        <div class="booking-card-header">
                            <div class="booking-ref">
                                <i class="fas fa-ticket-alt"></i>
                                <strong>${booking.booking_reference}</strong>
                                <span class="booking-date">• ${formatDateTime(booking.booking_date)}</span>
                            </div>
                            <span class="status-badge ${getStatusClass(booking.status)}">
                                <i class="fas ${statusIcon}"></i> ${statusLabel}
                            </span>
                        </div>
                        
                        <div class="booking-card-body">
                            <div class="booking-image">
                                <img src="${booking.tour_image || 'https://via.placeholder.com/400x250'}" 
                                     alt="${booking.tour_title}" 
                                     onerror="this.src='https://via.placeholder.com/400x250'">
                            </div>
                            <div class="booking-details">
                                <h3 class="booking-tour-title">${booking.tour_title || 'Tour'}</h3>
                                <div class="booking-info-grid">
                                    <div class="booking-info-item">
                                        <i class="fas fa-map-marker-alt"></i>
                                        <span>${booking.destination_name || '-'}</span>
                                    </div>
                                    <div class="booking-info-item">
                                        <i class="fas fa-calendar-alt"></i>
                                        <span>${booking.departure_date ? formatDate(booking.departure_date) : 'Tự chọn'}</span>
                                    </div>
                                    <div class="booking-info-item">
                                        <i class="fas fa-users"></i>
                                        <span>${booking.num_adults} Người lớn${booking.num_children ? `, ${booking.num_children} Trẻ em` : ''}</span>
                                    </div>
                                    <div class="booking-info-item">
                                        <i class="fas fa-credit-card"></i>
                                        <span>${paymentStatusLabels[booking.payment_status] || 'Chưa TT'}</span>
                                    </div>
                                </div>
                                <div class="booking-total">
                                    <span class="booking-total-label">Tổng tiền:</span>
                                    <span class="booking-total-amount">${formatPrice(booking.total_price || 0)}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="booking-card-footer">
                            <button type="button" data-ref="${booking.booking_reference}" class="btn-booking-action btn-view-detail">
                                <i class="fas fa-copy"></i> Sao chép mã
                            </button>
                            ${allowReview ? `
                                <a href="tour-detail.html?id=${booking.tour_id}#reviews" class="btn-booking-action btn-review">
                                    <i class="fas fa-star"></i> Đánh giá
                                </a>
                            ` : ''}
                            ${allowCancel ? `
                                <button type="button" class="btn-booking-action btn-cancel" data-id="${booking.booking_id}">
                                    <i class="fas fa-times"></i> Hủy tour
                                </button>
                            ` : ''}
                        </div>
                    </article>
                `;
            })
            .join('');
    }

    function initFilterTabs() {
        const tabs = document.querySelectorAll('.filter-tab');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Update active state
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Update filter status
                bookingsState.filterStatus = tab.dataset.status || '';
                
                // Apply all filters
                applyFilters();
            });
        });
    }

    function initSearch() {
        const searchInput = getElement('searchBooking');
        const clearBtn = getElement('btnClearSearch');

        if (searchInput) {
            searchInput.addEventListener('input', debounce((e) => {
                bookingsState.searchTerm = e.target.value.trim();
                applyFilters();
            }, 300));

            // Enter key to search
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    bookingsState.searchTerm = searchInput.value.trim();
                    applyFilters();
                }
            });
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                if (searchInput) searchInput.value = '';
                bookingsState.searchTerm = '';
                applyFilters();
            });
        }
    }

    // Debounce helper
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    function bindBookingsEvents() {
        const list = getElement('bookingsList');

        list?.addEventListener('click', event => {
            const copyBtn = event.target.closest('[data-ref]');
            if (copyBtn && copyBtn.classList.contains('btn-view-detail')) {
                const ref = copyBtn.dataset.ref;
                navigator.clipboard.writeText(ref).then(() => {
                    showToast('Đã sao chép mã đặt chỗ', 'success');
                });
                return;
            }

            const cancelBtn = event.target.closest('.btn-cancel');
            if (cancelBtn) {
                const bookingId = cancelBtn.dataset.id;
                if (!bookingId) return;
                
                // Show confirm dialog
                showCancelConfirm(bookingId, cancelBtn);
                return;
            }
        });
    }

    function showCancelConfirm(bookingId, button) {
        const confirmed = window.confirm('Bạn chắc chắn muốn hủy tour này?\n\nLưu ý: Phí hủy tour có thể được áp dụng theo chính sách của chúng tôi.');
        if (!confirmed) return;
        cancelBooking(bookingId, button);
    }

    async function cancelBooking(bookingId, button) {
        if (!bookingId) return;
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';
        
        try {
            await apiRequest(`/bookings/${bookingId}/cancel`, { method: 'PUT' });
            showToast('Đã hủy tour thành công', 'success');
            loadBookings();
        } catch (error) {
            console.error('cancelBooking error:', error);
            showToast(error.message || 'Không thể hủy tour', 'error');
            button.innerHTML = '<i class="fas fa-times"></i> Hủy tour';
        } finally {
            button.disabled = false;
        }
    }

    function initFloatingButtons() {
        const scrollTopBtn = document.getElementById('scrollTopBtn');
        if (!scrollTopBtn) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    function initBookingsPage() {
        if (!window.TourBooking) {
            console.error('TourBooking helpers missing');
            return;
        }

        if (!isLoggedIn()) {
            showToast('Vui lòng đăng nhập để xem đặt tour', 'error');
            window.location.href = 'login.html';
            return;
        }

        initFilterTabs();
        initSearch();
        bindBookingsEvents();
        loadBookings();
        initFloatingButtons();
    }

    document.addEventListener('DOMContentLoaded', initBookingsPage);
})();

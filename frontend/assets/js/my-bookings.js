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
        items: []
    };

    const ONLINE_PAYMENT_METHODS = ['bank_card', 'momo', 'apple_pay'];

    const paymentMethodLabels = {
        bank_card: 'Thẻ ngân hàng',
        bank_transfer: 'Chuyển khoản',
        momo: 'MoMo',
        apple_pay: 'Apple Pay',
        cash: 'Tiền mặt',
        credit_card: 'Thẻ tín dụng',
        other: 'Khác'
    };

    const paymentStatusLabels = {
        pending: 'Chưa thanh toán',
        paid: 'Đã thanh toán',
        partial: 'Thanh toán một phần',
        refunded: 'Đã hoàn tiền',
        cancelled: 'Hủy thanh toán'
    };

    function getElement(id) {
        return document.getElementById(id);
    }

    function getStatusClass(status) {
        switch (status) {
            case 'confirmed':
                return 'status-confirmed';
            case 'cancelled':
                return 'status-cancelled';
            default:
                return 'status-pending';
        }
    }

    async function loadBookings() {
        const loading = getElement('loadingBookings');
        const empty = getElement('emptyBookings');
        if (loading) loading.style.display = 'block';
        if (empty) empty.style.display = 'none';

        try {
            const params = bookingsState.filterStatus ? `?status=${bookingsState.filterStatus}` : '';
            const res = await apiRequest(`/bookings/my-history${params}`);
            if (!res.success) return;
            bookingsState.items = res.data || [];
            renderBookings(bookingsState.items);
        } catch (error) {
            console.error('loadBookings error:', error);
            showToast('Không thể tải lịch sử đặt tour', 'error');
        } finally {
            if (loading) loading.style.display = 'none';
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
                const allowPay = booking.payment_status !== 'paid' && booking.status !== 'cancelled';
                const paymentLabel = paymentStatusLabels[booking.payment_status] || 'Không rõ';
                const paymentMethodLabel = paymentMethodLabels[booking.payment_method] || '---';

                return `
                    <article class="booking-card" data-booking-id="${booking.booking_id}">
                        <header>
                            <div>
                                <p class="booking-ref">Mã đặt chỗ: ${booking.booking_reference}</p>
                                <small>${formatDateTime(booking.booking_date)}</small>
                            </div>
                            <span class="status-badge ${getStatusClass(booking.status)}">${booking.status}</span>
                        </header>
                        <div class="booking-body">
                            <div class="booking-info">
                                <h3>${booking.tour_title || 'Tour'}</h3>
                                <ul>
                                    <li><span>Điểm đến</span><strong>${booking.destination_name || '-'}</strong></li>
                                    <li><span>Ngày đi</span><strong>${booking.departure_date ? formatDate(booking.departure_date) : 'Tự chọn'}</strong></li>
                                    <li><span>Hành khách</span><strong>${booking.num_adults} NL${booking.num_children ? `, ${booking.num_children} TE` : ''}</strong></li>
                                    <li><span>Thanh toán</span><strong>${paymentLabel} - ${paymentMethodLabel}</strong></li>
                                    <li><span>Tổng tiền</span><strong>${formatPrice(booking.total_price || 0)}</strong></li>
                                </ul>
                            </div>
                            <div>
                                <img src="${booking.tour_image || 'https://via.placeholder.com/400x250'}" alt="${booking.tour_title}" onerror="this.src='https://via.placeholder.com/400x250'">
                            </div>
                        </div>
                        <div class="booking-actions">
                            <button type="button" data-ref="${booking.booking_reference}" class="btn-copy-ref">
                                <i class="fas fa-copy"></i> Sao chép mã
                            </button>
                            ${allowCancel ? `<button type="button" class="btn-cancel-booking" data-id="${booking.booking_id}">Huỷ tour</button>` : ''}
                        </div>
                        ${allowPay ? `
                            <div class="payment-inline">
                                <label>Thanh toán online:</label>
                                <div class="payment-inline-controls">
                                    <select class="payment-method-select">
                                        ${ONLINE_PAYMENT_METHODS.map(method => `
                                            <option value="${method}" ${booking.payment_method === method ? 'selected' : ''}>${paymentMethodLabels[method]}</option>
                                        `).join('')}
                                    </select>
                                    <button type="button" class="btn-pay-booking" data-id="${booking.booking_id}">Thanh toán</button>
                                </div>
                            </div>
                        ` : ''}
                    </article>
                `;
            })
            .join('');
    }

    function bindBookingsEvents() {
        const statusSelect = getElement('filterStatus');
        const list = getElement('bookingsList');

        statusSelect?.addEventListener('change', event => {
            bookingsState.filterStatus = event.target.value;
            loadBookings();
        });

        list?.addEventListener('click', event => {
            const copyBtn = event.target.closest('.btn-copy-ref');
            if (copyBtn) {
                const ref = copyBtn.dataset.ref;
                navigator.clipboard.writeText(ref).then(() => {
                    showToast('Đã sao chép mã đặt chỗ', 'success');
                });
                return;
            }

            const cancelBtn = event.target.closest('.btn-cancel-booking');
            if (cancelBtn) {
                const bookingId = cancelBtn.dataset.id;
                if (!bookingId) return;
                const confirmed = window.confirm('Bạn chắc chắn muốn huỷ tour này?');
                if (!confirmed) return;
                cancelBooking(bookingId, cancelBtn);
                return;
            }

            const payBtn = event.target.closest('.btn-pay-booking');
            if (payBtn) {
                const bookingCard = payBtn.closest('.booking-card');
                const select = bookingCard?.querySelector('.payment-method-select');
                const method = select?.value || 'bank_card';
                payBooking(payBtn.dataset.id, method, payBtn);
            }
        });
    }

    async function cancelBooking(bookingId, button) {
        if (!bookingId) return;
        button.disabled = true;
        try {
            await apiRequest(`/bookings/${bookingId}/cancel`, { method: 'PUT' });
            showToast('Đã huỷ tour thành công', 'success');
            loadBookings();
        } catch (error) {
            console.error('cancelBooking error:', error);
            showToast(error.message || 'Không thể huỷ tour', 'error');
        } finally {
            button.disabled = false;
        }
    }

    async function payBooking(bookingId, method, button) {
        if (!bookingId) return;
        button.disabled = true;
        try {
            await apiRequest(`/bookings/${bookingId}/pay`, {
                method: 'POST',
                body: JSON.stringify({ payment_method: method })
            });
            showToast('Thanh toán thành công', 'success');
            loadBookings();
        } catch (error) {
            console.error('payBooking error:', error);
            showToast(error.message || 'Không thể thanh toán', 'error');
        } finally {
            button.disabled = false;
        }
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

        bindBookingsEvents();
        loadBookings();
    }

    document.addEventListener('DOMContentLoaded', initBookingsPage);
})();

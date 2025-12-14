(() => {
const {
    apiRequest,
    formatPrice,
    formatDate,
    showToast,
    isLoggedIn,
    getUserData,
    getTourImage
} = window.TourBooking || {};

if (!window.TourBooking) {
    console.error('TourBooking helpers are not available. Please ensure main.js is loaded first.');
}

// Payment methods that are processed instantly (online payments)
const ONLINE_PAYMENT_METHODS = new Set([
    'momo', 'zalopay', 'vnpay', 'bank_card', 'credit_card'
]);

// Payment method display labels
const PAYMENT_METHOD_LABELS = {
    momo: 'Ví MoMo',
    zalopay: 'Ví ZaloPay',
    vnpay: 'Ví VNPay',
    bank_card: 'Thẻ ATM nội địa',
    credit_card: 'Thẻ Visa/Master',
    bank_transfer: 'Chuyển khoản ngân hàng',
    pay_later: 'Thanh toán tại văn phòng',
    installment: 'Trả góp 0%'
};

const state = {
    tourId: null,
    tourData: null,
    schedules: [],
    pricing: {
        total_price: 0,
        price_adult: 0,
        price_child: 0,
        price_infant: 0
    },
    galleryIndex: 0,
    galleryImages: []
};

function getElement(id) {
    return document.getElementById(id);
}

function setText(id, value) {
    const el = getElement(id);
    if (el) {
        el.textContent = value || '';
    }
}

async function initTourDetailPage() {
    state.tourId = window.TourBooking.getQueryParam('id');

    if (!state.tourId) {
        showToast('Không tìm thấy mã tour', 'error');
        return;
    }

    toggleLoading(true);
    await loadTourDetails();
    await loadReviews(); // Load reviews separately
    bindQuantityControls();
    bindBookingActions();
}

async function loadTourDetails() {
    try {
        const res = await apiRequest(`/tours/${state.tourId}`);
        if (!res.success) {
            throw new Error('Không thể tải dữ liệu tour');
        }
        state.tourData = res.data.tour;
        state.schedules = res.data.schedules || [];

        renderTourInfo(res.data);
        renderSchedules(state.schedules);
        renderReviews(res.data.reviews);
        renderRelatedTours(res.data.related_tours || []);
        setupGalleryNavigation();
        toggleLoading(false);
        await updatePriceSummary();
    } catch (error) {
        console.error('loadTourDetails error:', error);
        showToast('Không thể tải thông tin tour', 'error');
        toggleLoading(false);
    }
}

function toggleLoading(isLoading) {
    const loadingEl = getElement('loadingTour');
    const contentEl = getElement('tourDetailContainer');
    if (!loadingEl || !contentEl) return;

    loadingEl.style.display = isLoading ? 'block' : 'none';
    contentEl.style.display = isLoading ? 'none' : 'block';
}

function renderTourInfo(data) {
    const { tour } = data;
    if (!tour) return;

    setText('tourTitle', tour.title);
    document.title = `${tour.title} - Du Lịch Việt Nam`;

    const ratingScore = tour.rating_average ? Number(tour.rating_average).toFixed(1) : '5.0';
    const ratingCount = tour.review_count || 0;
    const ratingEl = getElement('tourRating');
    if (ratingEl) {
        ratingEl.querySelector('.rating-score').textContent = ratingScore;
        ratingEl.querySelector('.rating-count').textContent = `(${ratingCount} đánh giá)`;
    }

    setText('breadcrumbTitle', tour.title);

    const locationEl = getElement('tourLocation');
    if (locationEl) {
        locationEl.querySelector('span').textContent = `${tour.destination_name || ''} - ${tour.country || 'Việt Nam'}`;
    }

    const codeEl = getElement('tourCode');
    if (codeEl) {
        codeEl.querySelector('span').textContent = `Mã tour: ${tour.slug || tour.tour_id}`;
    }

    const mainImage = getElement('mainImage');
    const heroImage = typeof getTourImage === 'function' ? getTourImage(tour) : (tour.cover_image_url || 'https://via.placeholder.com/900x500');
    if (mainImage) {
        mainImage.src = heroImage;
        mainImage.alt = tour.title;
    }

    const gallery = Array.isArray(tour.image_gallery) ? tour.image_gallery : safelyParseJSON(tour.image_gallery);
    const thumbnails = getElement('thumbnailImages');
    if (thumbnails) {
        const fallbackGalleryImage = typeof getTourImage === 'function' ? getTourImage() : 'https://via.placeholder.com/900x500';
        const normalizeMediaPath = window.TourBooking?.normalizeMediaPath || (v => v);
        state.galleryImages = [heroImage, ...(gallery || []).map(normalizeMediaPath)].filter(Boolean);
        if (state.galleryImages.length === 0) {
            state.galleryImages.push(fallbackGalleryImage);
        }

        thumbnails.innerHTML = state.galleryImages
            .map((src, idx) => `
                <img src="${src}" alt="thumb-${idx}" data-index="${idx}">
            `)
            .join('');

        thumbnails.querySelectorAll('img').forEach(img => {
            img.addEventListener('click', (event) => {
                const index = Number(event.currentTarget.dataset.index);
                updateGalleryImage(index);
            });
        });
    }

    setText('tourDuration', `${tour.duration_days} ngày ${tour.duration_nights} đêm`);
    setText('tourTransport', tour.transportation || 'Máy bay + Ô tô');
    setText('tourHotel', tour.hotel_rating ? `${tour.hotel_rating} sao` : 'Khách sạn 3-4*');
    setText('tourGroup', tour.max_participants ? `Tối đa ${tour.max_participants} khách` : 'Nhóm nhỏ');

    const descriptionEl = getElement('tourDescription');
    if (descriptionEl) {
        descriptionEl.innerHTML = (tour.description || '').replace(/\n/g, '<br>');
    }

    const itineraryEl = getElement('tourItinerary');
    if (itineraryEl) {
        itineraryEl.innerHTML = (tour.itinerary || 'Đang cập nhật').replace(/\n/g, '<br>');
    }

    renderList('tourInclusions', tour.inclusions, 'Đang cập nhật');
    renderList('tourExclusions', tour.exclusions, 'Đang cập nhật');

    setText('tourPrice', formatPrice(tour.price_adult || 0));
    state.pricing.price_adult = tour.price_adult || 0;
    state.pricing.price_child = tour.price_child || 0;
    state.pricing.price_infant = tour.price_infant || 0;
}

function renderList(id, items, emptyLabel) {
    const el = getElement(id);
    if (!el) return;

    if (!items || items.length === 0) {
        el.innerHTML = `<li>${emptyLabel}</li>`;
        return;
    }

    const normalized = Array.isArray(items) ? items : safelyParseJSON(items);
    el.innerHTML = normalized
        .filter(Boolean)
        .map(item => `<li>${item}</li>`)
        .join('');
}

function safelyParseJSON(value) {
    if (!value) return [];
    try {
        return typeof value === 'string' ? JSON.parse(value) : value;
    } catch (error) {
        return [];
    }
}

function setupGalleryNavigation() {
    const prevBtn = getElement('galleryPrev');
    const nextBtn = getElement('galleryNext');

    prevBtn?.addEventListener('click', () => {
        if (state.galleryImages.length === 0) return;
        state.galleryIndex = (state.galleryIndex - 1 + state.galleryImages.length) % state.galleryImages.length;
        updateGalleryImage(state.galleryIndex);
    });

    nextBtn?.addEventListener('click', () => {
        if (state.galleryImages.length === 0) return;
        state.galleryIndex = (state.galleryIndex + 1) % state.galleryImages.length;
        updateGalleryImage(state.galleryIndex);
    });
}

function updateGalleryImage(index) {
    const mainImage = getElement('mainImage');
    if (!mainImage || !state.galleryImages[index]) return;
    state.galleryIndex = index;
    mainImage.src = state.galleryImages[index];
}

function renderSchedules(schedules) {
    const select = getElement('departureDate');
    if (!select) return;

    select.innerHTML = '<option value="">Chọn ngày khởi hành</option>';

    if (!Array.isArray(schedules) || schedules.length === 0) {
        select.disabled = true;
        return;
    }

    schedules.forEach(schedule => {
        const option = document.createElement('option');
        option.value = schedule.schedule_id;
        option.textContent = `${formatDate(schedule.departure_date)} - còn ${(schedule.available_slots - schedule.booked_slots)} chỗ`;
        select.appendChild(option);
    });

    select.addEventListener('change', () => {
        updatePriceSummary();
    });
}

function renderReviews(reviewsData) {
    const summaryEl = getElement('reviewsSummary');
    const listEl = getElement('reviewsList');
    if (!summaryEl || !listEl || !reviewsData) return;

    const { stats, items } = reviewsData;
    const avg = stats?.avg_rating ? Number(stats.avg_rating).toFixed(1) : '5.0';
    const count = stats?.review_count || 0;

    summaryEl.innerHTML = `
        <div class="review-score">
            <div class="score-number">${avg}</div>
            <div class="score-meta">Dựa trên ${count} đánh giá</div>
        </div>
    `;

    if (!items || items.length === 0) {
        listEl.innerHTML = '<p>Chưa có đánh giá nào</p>';
        return;
    }

    listEl.innerHTML = items
        .map(review => `
            <div class="review-card">
                <div class="review-header">
                    <strong>${review.user_name || 'Khách hàng'}</strong>
                    <span>${formatDate(review.created_at)}</span>
                </div>
                <div class="review-rating">${'★'.repeat(review.rating || 5)}</div>
                <p>${review.comment || ''}</p>
            </div>
        `)
        .join('');
}

function renderRelatedTours(relatedTours) {
    const grid = getElement('relatedToursGrid');
    if (!grid) return;

    if (!relatedTours || relatedTours.length === 0) {
        grid.innerHTML = '<p>Chưa có tour liên quan</p>';
        return;
    }

    const defaultImage = typeof getTourImage === 'function' ? getTourImage() : 'https://via.placeholder.com/400x300';
    grid.innerHTML = relatedTours
        .map(tour => {
            const imageSrc = typeof getTourImage === 'function' ? getTourImage(tour) : (tour.cover_image_url || defaultImage);
            return `
            <div class="tour-card" onclick="window.location.href='tour-detail.html?id=${tour.tour_id}'">
                <div class="tour-image">
                    <img src="${imageSrc}" alt="${tour.title}" onerror="this.src='${defaultImage}'">
                </div>
                <div class="tour-content">
                    <h3>${tour.title}</h3>
                    <p>${tour.destination_name || ''}</p>
                    <span>${formatPrice(tour.price_adult || 0)}</span>
                </div>
            </div>
        `;
        })
        .join('');
}

function bindQuantityControls() {
    document.querySelectorAll('.number-input').forEach(wrapper => {
        const input = wrapper.querySelector('input');
        const minus = wrapper.querySelector('.btn-minus');
        const plus = wrapper.querySelector('.btn-plus');

        minus?.addEventListener('click', () => {
            const min = Number(input.min) || 0;
            const current = Number(input.value) || min;
            if (current > min) {
                input.value = current - 1;
                updatePriceSummary();
            }
        });

        plus?.addEventListener('click', () => {
            const current = Number(input.value) || 0;
            input.value = current + 1;
            updatePriceSummary();
        });
    });
}

async function updatePriceSummary() {
    try {
        if (!state.tourId) return;
        const numAdults = Number(getElement('numAdults')?.value || 1);
        const numChildren = Number(getElement('numChildren')?.value || 0);
        const numInfants = Number(getElement('numInfants')?.value || 0);
        const scheduleId = getElement('departureDate')?.value || null;

        const res = await apiRequest('/bookings/calculate-price', {
            method: 'POST',
            body: JSON.stringify({
                tour_id: Number(state.tourId),
                schedule_id: scheduleId ? Number(scheduleId) : null,
                num_adults: numAdults,
                num_children: numChildren,
                num_infants: numInfants
            })
        });

        if (res.success) {
            state.pricing = res.data;
            
            // Update detailed price breakdown
            const adultCount = getElement('adultCount');
            const adultTotal = getElement('adultTotal');
            const childCount = getElement('childCount');
            const childTotal = getElement('childTotal');
            const childPriceRow = getElement('childPriceRow');
            const infantCount = getElement('infantCount');
            const infantTotal = getElement('infantTotal');
            const infantPriceRow = getElement('infantPriceRow');
            
            if (adultCount) adultCount.textContent = numAdults;
            if (adultTotal) adultTotal.textContent = formatPrice(state.pricing.price_adult * numAdults);
            
            if (childPriceRow) {
                childPriceRow.style.display = numChildren > 0 ? 'flex' : 'none';
                if (childCount) childCount.textContent = numChildren;
                if (childTotal) childTotal.textContent = formatPrice(state.pricing.price_child * numChildren);
            }
            
            if (infantPriceRow) {
                infantPriceRow.style.display = numInfants > 0 ? 'flex' : 'none';
                if (infantCount) infantCount.textContent = numInfants;
                if (infantTotal) infantTotal.textContent = formatPrice(state.pricing.price_infant * numInfants);
            }
            
            setText('totalPrice', formatPrice(res.data.total_price));
        }
    } catch (error) {
        console.error('updatePriceSummary error:', error);
    }
}

function bindBookingActions() {
    const bookButton = getElement('btnBookNow');
    if (bookButton) {
        bookButton.addEventListener('click', openPaymentModal);
    }
    
    // Initialize payment modal
    initPaymentModal();
}

// ===== PAYMENT MODAL SYSTEM =====
let currentPaymentStep = 1;

function initPaymentModal() {
    const modal = getElement('paymentModal');
    const closeBtn = getElement('closePaymentModal');
    const overlay = document.querySelector('.payment-modal-overlay');
    
    // Close modal
    if (closeBtn) {
        closeBtn.addEventListener('click', closePaymentModal);
    }
    if (overlay) {
        overlay.addEventListener('click', closePaymentModal);
    }
    
    // Step navigation
    getElement('btnToStep2')?.addEventListener('click', goToPaymentStep2);
    getElement('btnBackToStep1')?.addEventListener('click', () => setPaymentStep(1));
    getElement('btnConfirmPayment')?.addEventListener('click', confirmPayment);
    getElement('btnCloseModal')?.addEventListener('click', closePaymentModal);
    
    // Payment method selection
    document.querySelectorAll('input[name="paymentMethod"]').forEach(input => {
        input.addEventListener('change', () => {
            // Visual feedback for selected option
            document.querySelectorAll('.payment-option-content').forEach(el => {
                el.style.borderColor = '#e5e7eb';
                el.style.background = 'transparent';
            });
            const selected = input.nextElementSibling;
            if (selected) {
                selected.style.borderColor = '#ff6b35';
                selected.style.background = 'rgba(255, 107, 53, 0.05)';
            }
        });
    });
}

function openPaymentModal() {
    if (!isLoggedIn()) {
        showToast('Vui lòng đăng nhập để đặt tour', 'error');
        window.location.href = 'login.html';
        return;
    }

    const scheduleId = getElement('departureDate')?.value;
    if (!scheduleId) {
        showToast('Vui lòng chọn ngày khởi hành', 'error');
        return;
    }

    // Pre-fill contact info from user data
    const user = getUserData() || {};
    getElement('contactName').value = user.full_name || '';
    getElement('contactEmail').value = user.email || '';
    getElement('contactPhone').value = user.phone || '';
    
    // Update booking summary
    const numAdults = Number(getElement('numAdults')?.value || 1);
    const numChildren = Number(getElement('numChildren')?.value || 0);
    const numInfants = Number(getElement('numInfants')?.value || 0);
    const departureSelect = getElement('departureDate');
    const selectedOption = departureSelect?.options[departureSelect.selectedIndex];
    
    setText('summaryTourName', state.tourData?.title || '-');
    setText('summaryDate', selectedOption?.text || '-');
    setText('summaryGuests', `${numAdults} NL, ${numChildren} TE, ${numInfants} EB`);
    setText('summaryTotal', getElement('totalPrice')?.textContent || '-');
    
    // Reset to step 1 and show modal
    setPaymentStep(1);
    const modal = getElement('paymentModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closePaymentModal() {
    const modal = getElement('paymentModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function setPaymentStep(step) {
    currentPaymentStep = step;
    
    // Update step indicators
    document.querySelectorAll('.payment-steps .step').forEach((el, index) => {
        el.classList.remove('active', 'completed');
        if (index + 1 < step) {
            el.classList.add('completed');
        } else if (index + 1 === step) {
            el.classList.add('active');
        }
    });
    
    // Show/hide step content
    document.querySelectorAll('.payment-step-content').forEach((el, index) => {
        el.classList.remove('active');
        if (index + 1 === step) {
            el.classList.add('active');
        }
    });
}

function goToPaymentStep2() {
    // Validate step 1 fields
    const name = getElement('contactName')?.value.trim();
    const email = getElement('contactEmail')?.value.trim();
    const phone = getElement('contactPhone')?.value.trim();
    
    if (!name) {
        showToast('Vui lòng nhập họ và tên', 'error');
        getElement('contactName')?.focus();
        return;
    }
    if (!email || !email.includes('@')) {
        showToast('Vui lòng nhập email hợp lệ', 'error');
        getElement('contactEmail')?.focus();
        return;
    }
    if (!phone || phone.length < 9) {
        showToast('Vui lòng nhập số điện thoại hợp lệ', 'error');
        getElement('contactPhone')?.focus();
        return;
    }
    
    setPaymentStep(2);
}

async function confirmPayment() {
    // Get selected payment method
    const selectedPayment = document.querySelector('input[name="paymentMethod"]:checked');
    if (!selectedPayment) {
        showToast('Vui lòng chọn phương thức thanh toán', 'error');
        return;
    }
    
    const paymentMethod = selectedPayment.value;
    const scheduleId = getElement('departureDate')?.value;
    const numAdults = Number(getElement('numAdults')?.value || 1);
    const numChildren = Number(getElement('numChildren')?.value || 0);
    const numInfants = Number(getElement('numInfants')?.value || 0);
    
    const payload = {
        tour_id: Number(state.tourId),
        schedule_id: Number(scheduleId),
        num_adults: numAdults,
        num_children: numChildren,
        num_infants: numInfants,
        contact_name: getElement('contactName')?.value.trim(),
        contact_email: getElement('contactEmail')?.value.trim(),
        contact_phone: getElement('contactPhone')?.value.trim(),
        contact_address: getElement('contactAddress')?.value.trim() || '',
        payment_method: paymentMethod,
        special_requests: getElement('specialRequests')?.value.trim() || ''
    };
    
    // Disable button during processing
    const confirmBtn = getElement('btnConfirmPayment');
    if (confirmBtn) {
        confirmBtn.disabled = true;
        confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';
    }
    
    try {
        const res = await apiRequest('/bookings', {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        if (res.success) {
            // Update confirmation details
            setText('confirmBookingRef', res.data.booking_reference);
            
            // Update payment method display
            const paymentLabel = PAYMENT_METHOD_LABELS[paymentMethod] || paymentMethod;
            const paymentMethodEl = document.getElementById('confirmPaymentMethod');
            if (paymentMethodEl) {
                paymentMethodEl.textContent = paymentLabel;
            }
            
            // Update status based on payment method
            const isInstant = ONLINE_PAYMENT_METHODS.has(paymentMethod);
            setText('confirmStatus', isInstant ? 'Đã xác nhận' : 'Chờ xác nhận thanh toán');
            
            // Update confirmation note based on payment method
            const noteEl = document.querySelector('.confirmation-note p');
            if (noteEl) {
                if (isInstant) {
                    noteEl.textContent = 'Thanh toán của bạn đã được xử lý thành công. Email xác nhận đã được gửi đến địa chỉ email của bạn.';
                } else if (paymentMethod === 'bank_transfer') {
                    noteEl.textContent = 'Vui lòng chuyển khoản trong vòng 24h để hoàn tất đặt tour. Thông tin chuyển khoản đã được gửi đến email của bạn.';
                } else if (paymentMethod === 'pay_later') {
                    noteEl.textContent = 'Vui lòng đến văn phòng để thanh toán trước ngày khởi hành. Địa chỉ và thông tin liên hệ đã được gửi đến email của bạn.';
                } else if (paymentMethod === 'installment') {
                    noteEl.textContent = 'Nhân viên sẽ liên hệ với bạn trong vòng 24h để hoàn tất thủ tục trả góp.';
                }
            }
            
            // Go to step 3 (success)
            setPaymentStep(3);
            
            showToast('Đặt tour thành công!', 'success');
        }
    } catch (error) {
        console.error('confirmPayment error:', error);
        showToast(error.message || 'Không thể đặt tour. Vui lòng thử lại.', 'error');
    } finally {
        if (confirmBtn) {
            confirmBtn.disabled = false;
            confirmBtn.innerHTML = '<i class="fas fa-check"></i> Xác nhận thanh toán';
        }
    }
}

// Legacy handleBooking function (kept for compatibility)
async function handleBooking() {
    openPaymentModal();
}

// ===== REVIEW SYSTEM =====
let selectedRating = 0;

function initReviewModal() {
    const modal = document.getElementById('reviewModal');
    const btnOpenModal = document.getElementById('btnWriteReview');
    const btnCloseModal = document.getElementById('closeReviewModal');
    const stars = document.querySelectorAll('.star-rating i');
    const reviewForm = document.getElementById('reviewForm');

    if (btnOpenModal) {
        btnOpenModal.addEventListener('click', () => {
            if (!isLoggedIn()) {
                showToast('Vui lòng đăng nhập để viết đánh giá', 'error');
                window.location.href = 'login.html';
                return;
            }
            modal.style.display = 'flex';
        });
    }

    if (btnCloseModal) {
        btnCloseModal.addEventListener('click', () => {
            modal.style.display = 'none';
            resetReviewForm();
        });
    }

    // Click outside modal to close
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            resetReviewForm();
        }
    });

    // Star rating interaction
    stars.forEach((star, index) => {
        star.addEventListener('click', () => {
            selectedRating = index + 1;
            document.getElementById('rating').value = selectedRating;
            updateStarDisplay(index);
        });

        star.addEventListener('mouseenter', () => {
            updateStarDisplay(index);
        });
    });

    document.querySelector('.star-rating').addEventListener('mouseleave', () => {
        updateStarDisplay(selectedRating - 1);
    });

    if (reviewForm) {
        reviewForm.addEventListener('submit', handleReviewSubmit);
    }
}

function updateStarDisplay(index) {
    const stars = document.querySelectorAll('.star-rating i');
    stars.forEach((star, i) => {
        if (i <= index) {
            star.classList.remove('far');
            star.classList.add('fas');
            star.style.color = '#ffc107';
        } else {
            star.classList.remove('fas');
            star.classList.add('far');
            star.style.color = '#ccc';
        }
    });
}

function resetReviewForm() {
    selectedRating = 0;
    document.getElementById('reviewForm').reset();
    updateStarDisplay(-1);
}

async function handleReviewSubmit(e) {
    e.preventDefault();

    const rating = document.getElementById('rating').value;
    if (!rating) {
        showToast('Vui lòng chọn số sao đánh giá', 'error');
        return;
    }

    const formData = new FormData(e.target);
    const payload = {
        tour_id: Number(state.tourId),
        rating: Number(rating),
        title: formData.get('title') || '',
        comment: formData.get('comment'),
        rating_service: formData.get('rating_service') ? Number(formData.get('rating_service')) : null,
        rating_location: formData.get('rating_location') ? Number(formData.get('rating_location')) : null,
        rating_price: formData.get('rating_price') ? Number(formData.get('rating_price')) : null,
        rating_food: formData.get('rating_food') ? Number(formData.get('rating_food')) : null
    };

    try {
        const res = await apiRequest('/reviews', {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        if (res.success) {
            showToast('Đánh giá thành công!', 'success');
            document.getElementById('reviewModal').style.display = 'none';
            resetReviewForm();
            
            // Reload reviews and update rating
            await loadReviews();
            await loadTourDetails();
        }
    } catch (error) {
        console.error('Review submit error:', error);
        showToast(error.message || 'Không thể gửi đánh giá', 'error');
    }
}

async function loadReviews() {
    try {
        const res = await apiRequest(`/tours/${state.tourId}/reviews`);
        if (res.success && res.data) {
            displayReviews(res.data.reviews || []);
        }
    } catch (error) {
        console.error('Load reviews error:', error);
        const container = document.getElementById('reviewsContainer');
        if (container) {
            container.innerHTML = '<p class="no-reviews">Chưa có đánh giá nào.</p>';
        }
    }
}

function displayReviews(reviews) {
    const container = document.getElementById('reviewsContainer');
    if (!container) return;

    if (!reviews || reviews.length === 0) {
        container.innerHTML = '<p class="no-reviews">Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá!</p>';
        return;
    }

    container.innerHTML = reviews.map(review => `
        <div class="review-item">
            <div class="review-header">
                <div class="reviewer-info">
                    <img src="${review.avatar_url || '/assets/images/default-avatar.png'}" alt="${review.reviewer_name}" class="reviewer-avatar">
                    <div>
                        <strong>${review.reviewer_name}</strong>
                        <div class="review-date">${formatDate(review.created_at)}</div>
                    </div>
                </div>
                <div class="review-rating">
                    ${generateStars(review.rating)}
                </div>
            </div>
            ${review.title ? `<h4 class="review-title">${review.title}</h4>` : ''}
            <p class="review-comment">${review.comment}</p>
            ${review.rating_service || review.rating_location || review.rating_price || review.rating_food ? `
                <div class="review-details">
                    ${review.rating_service ? `<span>Dịch vụ: ${review.rating_service}/5</span>` : ''}
                    ${review.rating_location ? `<span>Địa điểm: ${review.rating_location}/5</span>` : ''}
                    ${review.rating_price ? `<span>Giá cả: ${review.rating_price}/5</span>` : ''}
                    ${review.rating_food ? `<span>Ẩm thực: ${review.rating_food}/5</span>` : ''}
                </div>
            ` : ''}
        </div>
    `).join('');
}

function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star" style="color: #ffc107;"></i>';
        } else {
            stars += '<i class="far fa-star" style="color: #ccc;"></i>';
        }
    }
    return stars;
}

document.addEventListener('DOMContentLoaded', () => {
    initTourDetailPage();
    initReviewModal();
    initSocialProof();
    initFloatingButtons();
});

// ===== SOCIAL PROOF & URGENCY =====
function initSocialProof() {
    // Simulate random booking stats (would come from backend in production)
    const bookingsToday = Math.floor(Math.random() * 15) + 5;
    const viewsNow = Math.floor(Math.random() * 30) + 20;
    const seatsLeft = Math.floor(Math.random() * 8) + 2;
    
    const bookingsTodayEl = getElement('bookingsToday');
    const viewsNowEl = getElement('viewsNow');
    const seatsLeftEl = getElement('seatsLeft');
    
    if (bookingsTodayEl) bookingsTodayEl.textContent = bookingsToday;
    if (viewsNowEl) viewsNowEl.textContent = viewsNow;
    if (seatsLeftEl) seatsLeftEl.textContent = seatsLeft;
    
    // Simulate live views (update every 30 seconds)
    setInterval(() => {
        const newViews = Math.floor(Math.random() * 10) + 40;
        if (viewsNowEl) viewsNowEl.textContent = newViews;
    }, 30000);
}

// ===== FLOATING BUTTONS =====
function initFloatingButtons() {
    const scrollTopBtn = getElement('scrollTopBtn');
    
    if (scrollTopBtn) {
        // Show/hide scroll to top button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });
        
        // Scroll to top when clicked
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}
})();

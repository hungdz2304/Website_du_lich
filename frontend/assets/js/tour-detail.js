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

const ONLINE_PAYMENT_METHODS = new Set(['bank_card', 'momo', 'apple_pay']);

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
        state.galleryImages = [heroImage, ...(gallery || [])].filter(Boolean);
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
        const scheduleId = getElement('departureDate')?.value || null;

        const res = await apiRequest('/bookings/calculate-price', {
            method: 'POST',
            body: JSON.stringify({
                tour_id: Number(state.tourId),
                schedule_id: scheduleId ? Number(scheduleId) : null,
                num_adults: numAdults,
                num_children: numChildren,
                num_infants: 0
            })
        });

        if (res.success) {
            state.pricing = res.data;
            setText('totalPrice', formatPrice(res.data.total_price));
        }
    } catch (error) {
        console.error('updatePriceSummary error:', error);
    }
}

function bindBookingActions() {
    const bookButton = getElement('btnBookNow');
    if (bookButton) {
        bookButton.addEventListener('click', handleBooking);
    }
}

async function handleBooking() {
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

    const numAdults = Number(getElement('numAdults')?.value || 1);
    const numChildren = Number(getElement('numChildren')?.value || 0);
    const paymentMethod = getElement('paymentMethod')?.value || 'bank_card';
    const user = getUserData() || {};

    if (!user.full_name || !user.email) {
        showToast('Vui lòng cập nhật hồ sơ trước khi đặt tour', 'error');
        return;
    }

    const contactPhone = user.phone || prompt('Nhập số điện thoại liên hệ:');
    if (!contactPhone) {
        showToast('Cần nhập số điện thoại để đặt tour', 'error');
        return;
    }

    try {
        const payload = {
            tour_id: Number(state.tourId),
            schedule_id: Number(scheduleId),
            num_adults: numAdults,
            num_children: numChildren,
            num_infants: 0,
            contact_name: user.full_name,
            contact_email: user.email,
            contact_phone: contactPhone,
            payment_method: paymentMethod,
            special_requests: ''
        };

        const res = await apiRequest('/bookings', {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        if (res.success) {
            const instantPayment = ONLINE_PAYMENT_METHODS.has(paymentMethod);
            const message = instantPayment
                ? `Thanh toán thành công! Mã: ${res.data.booking_reference}`
                : `Đặt tour thành công! Mã: ${res.data.booking_reference}. Vui lòng thanh toán trong 24h.`;
            showToast(message, 'success');
        }
    } catch (error) {
        console.error('handleBooking error:', error);
        showToast(error.message || 'Không thể đặt tour', 'error');
    }
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
});
})();

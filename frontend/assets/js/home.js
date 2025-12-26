// ===========================================
// Homepage JavaScript - Enhanced Version
// ===========================================

(() => {
const { apiRequest, formatPrice, showToast, showLoading, hideLoading, getDestinationImage, getTourImage } = window.TourBooking;

const normalizeCountry = value => (value || '').toString().trim().toLowerCase();
const isDomesticTour = tour => normalizeCountry(tour?.destination_country || tour?.country) === 'vietnam' || !normalizeCountry(tour?.destination_country || tour?.country);

let featuredToursCache = { domestic: [], international: [] };
let currentFeaturedScope = 'domestic';
let searchScope = 'domestic';
let allDestinations = [];
let currentRegion = 'asia';
let flatpickrInstance = null;

// Region mapping for tour filtering
const regionCountries = {
    asia: ['japan', 'korea', 'china', 'thailand', 'singapore', 'malaysia', 'indonesia', 'taiwan', 'hong kong', 'philippines', 'cambodia', 'myanmar', 'laos', 'india', 'nhật bản', 'hàn quốc', 'trung quốc', 'thái lan', 'đài loan', 'hồng kông'],
    europe: ['france', 'italy', 'germany', 'spain', 'uk', 'england', 'switzerland', 'austria', 'netherlands', 'belgium', 'pháp', 'ý', 'đức', 'tây ban nha', 'anh', 'thụy sĩ', 'áo', 'hà lan', 'bỉ', 'châu âu'],
    america: ['usa', 'canada', 'mexico', 'brazil', 'mỹ', 'canada', 'mexico', 'châu mỹ'],
    domestic: ['vietnam', 'việt nam']
};

const getRatingScore = value => {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric.toFixed(1) : '5.0';
};

const normalizePrice = value => {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : 0;
};

// ===========================================
// Countdown Timer for Flash Sale
// ===========================================

function initCountdown() {
    // Set countdown end to midnight tonight
    const now = new Date();
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
    
    function updateCountdown() {
        const now = new Date();
        const diff = endOfDay - now;
        
        if (diff <= 0) {
            // Reset to next day
            endOfDay.setDate(endOfDay.getDate() + 1);
            return;
        }
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        const hoursEl = document.getElementById('countdownHours');
        const minutesEl = document.getElementById('countdownMinutes');
        const secondsEl = document.getElementById('countdownSeconds');
        
        if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
        if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
        if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// ===========================================
// Random Social Proof (X khách đặt trong 24h)
// ===========================================

function updateSocialProof() {
    const recentBookingsEl = document.getElementById('recentBookings');
    if (recentBookingsEl) {
        // Random between 8-25
        const count = Math.floor(Math.random() * 18) + 8;
        recentBookingsEl.textContent = count;
    }
}

function getRandomBookings() {
    return Math.floor(Math.random() * 5) + 1; // 1-5 bookings
}

// ===========================================
// Load Flash Sale Tours (Tours with discount)
// ===========================================

async function loadFlashSaleTours() {
    try {
        showLoading('loadingFlashSale');
        
        const response = await apiRequest('/tours?limit=20&sort=discount');
        
        hideLoading('loadingFlashSale');
        
        if (response.success) {
            // API returns { tours: [], pagination: {} }
            const allTours = response.data?.tours || response.data || [];
            // Filter tours with discount and sort by discount descending
            const discountTours = allTours
                .filter(t => t.discount_percentage > 0)
                .sort((a, b) => b.discount_percentage - a.discount_percentage);
            renderFlashSaleTours(discountTours.slice(0, 6));
        }
    } catch (error) {
        hideLoading('loadingFlashSale');
        console.error('Error loading flash sale tours:', error);
    }
}

function renderFlashSaleTours(tours) {
    const grid = document.getElementById('flashSaleToursGrid');
    if (!grid) return;
    
    if (tours.length === 0) {
        grid.innerHTML = '<p class="text-center" style="color:#fff;">Hiện chưa có tour ưu đãi</p>';
        return;
    }
    
    grid.innerHTML = tours.map(tour => `
        <div class="tour-card" onclick="window.location.href='tour-detail.html?id=${tour.tour_id}'">
            <div class="tour-image">
                <img src="${getTourImage(tour)}" 
                     alt="${tour.title}"
                     onerror="this.src='${getTourImage()}'">
                ${tour.discount_percentage > 0 ? `<span class="tour-badge">-${tour.discount_percentage}%</span>` : ''}
                <div class="social-proof-badge">
                    <i class="fas fa-fire"></i>
                    ${getRandomBookings()} khách đặt trong 24h
                </div>
            </div>
            <div class="tour-content">
                <h3 class="tour-name">${tour.title}</h3>
                <div class="tour-info">
                    <div class="tour-info-item">
                        <i class="fas fa-clock"></i>
                        <span>${tour.duration_days}N${tour.duration_nights}Đ</span>
                    </div>
                    <div class="tour-info-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${tour.destination_name}</span>
                    </div>
                </div>
                <div class="tour-rating">
                    <i class="fas fa-star"></i>
                    <span class="rating-score">${getRatingScore(tour.rating_average)}</span>
                    <span class="rating-text">Tuyệt vời</span>
                    <span class="rating-count">| ${tour.review_count || 0} đánh giá</span>
                </div>
                <div class="tour-footer">
                    <div class="tour-price">
                        <div class="price-row">
                            <span class="price-amount">${formatPrice(normalizePrice(tour.price_adult))}</span>
                        </div>
                        ${tour.original_price ? `<span class="original-price">${formatPrice(normalizePrice(tour.original_price))}</span>` : ''}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// ===========================================
// Load Featured Tours
// ===========================================

async function loadFeaturedTours() {
    try {
        showLoading('loadingFeatured');
        
        const response = await apiRequest('/tours/featured?limit=16');
        
        hideLoading('loadingFeatured');
        
        if (response.success) {
            // API may return { tours: [] } or array directly
            const allTours = response.data?.tours || response.data || [];
            featuredToursCache = splitFeaturedTours(allTours);
            renderFeaturedToursForScope(currentFeaturedScope);
        }
    } catch (error) {
        hideLoading('loadingFeatured');
        console.error('Error loading featured tours:', error);
        showToast('Không thể tải tour nổi bật', 'error');
    }
}

function splitFeaturedTours(tours = []) {
    const domestic = [];
    const international = [];

    tours.forEach(tour => {
        if (isDomesticTour(tour)) {
            domestic.push(tour);
        } else {
            international.push(tour);
        }
    });

    return { domestic, international };
}

function renderFeaturedToursForScope(scope = 'domestic') {
    currentFeaturedScope = scope;
    updateFeaturedTabUI(scope);
    const tours = featuredToursCache[scope] || [];
    renderFeaturedTours(tours, scope);
}

function renderFeaturedTours(tours, scope = 'domestic') {
    const grid = document.getElementById('featuredToursGrid');
    if (!grid) return;
    
    if (tours.length === 0) {
        grid.innerHTML = `<p class="text-center">${scope === 'domestic' ? 'Hiện chưa có tour trong nước nổi bật' : 'Hiện chưa có tour ngoài nước nổi bật'}</p>`;
        return;
    }
    
    grid.innerHTML = tours.map(tour => createTourCard(tour)).join('');
}

// ===========================================
// Generic Tour Card Creator
// ===========================================

function createTourCard(tour) {
    const bookings = getRandomBookings();
    return `
        <div class="tour-card" onclick="window.location.href='tour-detail.html?id=${tour.tour_id}'">
            <div class="tour-image">
                <img src="${getTourImage(tour)}" 
                     alt="${tour.title}"
                     onerror="this.src='${getTourImage()}'">
                ${tour.discount_percentage > 0 ? `<span class="tour-badge">-${tour.discount_percentage}%</span>` : ''}
                ${bookings > 2 ? `<div class="social-proof-badge"><i class="fas fa-users"></i> ${bookings} khách đặt trong 24h</div>` : ''}
            </div>
            <div class="tour-content">
                <h3 class="tour-name">${tour.title}</h3>
                <div class="tour-info">
                    <div class="tour-info-item">
                        <i class="fas fa-clock"></i>
                        <span>${tour.duration_days}N${tour.duration_nights}Đ</span>
                    </div>
                    <div class="tour-info-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${tour.destination_name}</span>
                    </div>
                </div>
                <div class="tour-rating">
                    <i class="fas fa-star"></i>
                    <span class="rating-score">${getRatingScore(tour.rating_average)}</span>
                    <span class="rating-count">(${tour.review_count || 0})</span>
                </div>
                <div class="tour-footer">
                    <div class="tour-price">
                        <div class="price-row">
                            <span class="price-amount">${formatPrice(normalizePrice(tour.price_adult))}</span>
                            ${tour.discount_percentage > 0 ? `<span class="discount-badge">-${tour.discount_percentage}%</span>` : ''}
                        </div>
                        ${tour.original_price ? `<span class="original-price">${formatPrice(normalizePrice(tour.original_price))}</span>` : ''}
                    </div>
                    <a href="tour-detail.html?id=${tour.tour_id}" class="btn-view-tour btn-full">Xem chi tiết</a>
                </div>
            </div>
        </div>
    `;
}

function updateFeaturedTabUI(scope) {
    const domesticBtn = document.getElementById('btnFeaturedDomestic');
    const internationalBtn = document.getElementById('btnFeaturedInternational');
    if (!domesticBtn || !internationalBtn) return;

    domesticBtn.classList.toggle('active', scope === 'domestic');
    internationalBtn.classList.toggle('active', scope === 'international');
}

// ===========================================
// Load Destinations
// ===========================================

async function loadDestinations() {
    try {
        showLoading('loadingDestinations');
        
        const response = await apiRequest('/destinations/featured?limit=6');
        
        hideLoading('loadingDestinations');
        
        if (response.success) {
            renderDestinations(response.data);
        }
    } catch (error) {
        hideLoading('loadingDestinations');
        console.error('Error loading destinations:', error);
        showToast('Không thể tải điểm đến', 'error');
    }
}

function renderDestinations(destinations) {
    const grid = document.getElementById('destinationsGrid');
    if (!grid) return;
    
    if (destinations.length === 0) {
        grid.innerHTML = '<p class="text-center">Không có điểm đến nào</p>';
        return;
    }
    
    grid.innerHTML = destinations.map((dest, index) => `
        <div class="destination-card ${index === 0 ? 'featured' : ''}" onclick="window.location.href='tour-list.html?destination_id=${dest.destination_id}'">
            <img src="${getDestinationImage(dest)}" 
                 alt="${dest.name}"
                 onerror="this.src='${getDestinationImage()}'">
            <span class="destination-tour-count">${dest.tour_count || 0} tour</span>
            <div class="destination-info">
                <h3 class="destination-name">${dest.name}</h3>
                <p class="destination-count">${dest.country || 'Việt Nam'}</p>
            </div>
        </div>
    `).join('');
}

// ===========================================
// Load Destinations for Search
// ===========================================

async function loadSearchDestinations() {
    try {
        const response = await apiRequest('/destinations');
        
        if (response.success) {
            allDestinations = response.data || [];
            renderDestinationOptions();
            renderCustomDestinationOptions();
        }
    } catch (error) {
        console.error('Error loading search destinations:', error);
    }
}

function filterDestinationsByScope(scope, destinations = []) {
    if (scope === 'international') {
        return destinations.filter(dest => normalizeCountry(dest.country) !== 'vietnam');
    }
    return destinations.filter(dest => normalizeCountry(dest.country) === 'vietnam');
}

function renderDestinationOptions() {
    const select = document.getElementById('searchDestination');
    if (!select) return;

    select.innerHTML = '<option value="">Tất cả điểm đến</option>';
    const filtered = filterDestinationsByScope(searchScope, allDestinations);
    filtered.forEach(dest => {
        const option = document.createElement('option');
        option.value = dest.destination_id;
        option.textContent = dest.name;
        select.appendChild(option);
    });
}

function renderCustomDestinationOptions() {
    const select = document.getElementById('customDestinations');
    if (!select) return;

    const selected = new Set(Array.from(select.selectedOptions || []).map(option => option.value));
    select.innerHTML = '';

    allDestinations.forEach(dest => {
        const option = document.createElement('option');
        option.value = dest.destination_id;
        option.textContent = dest.name;
        if (selected.has(String(dest.destination_id))) {
            option.selected = true;
        }
        select.appendChild(option);
    });
}

function getDestinationNameById(id) {
    const match = allDestinations.find(dest => Number(dest.destination_id) === Number(id));
    return match ? match.name : `ID ${id}`;
}

function formatPlanLabel(plan) {
    if (plan === 'budget') return 'Ưu tiên ngân sách';
    if (plan === 'balanced') return 'Cân bằng';
    if (plan === 'premium') return 'Trải nghiệm';
    return plan;
}

function renderCustomPlans(plans = [], summary = {}) {
    const result = document.getElementById('customTourResult');
    if (!result) return;

    if (!plans.length) {
        result.innerHTML = '<p class="muted">Không có phương án phù hợp.</p>';
        return;
    }

    const html = plans.map(plan => {
        const isFeasible = Boolean(plan.within_budget);
        const status = isFeasible
            ? 'Trong ngân sách'
            : 'Không khả thi trong ngân sách';
        const breakdownList = (plan.breakdown || []).map(entry => {
            const items = (entry.items || []).map(item => `${item.name} (${formatPrice(item.cost || 0)})`);
            return `<li>${getDestinationNameById(entry.destination_id)} - ${entry.days || 0} ngày: ${items.join(', ') || 'Không có mục'}</li>`;
        }).join('');

        const removed = (plan.removed_optional || []).map(item => `${item.name} (${formatPrice(item.cost || 0)})`);

        return `
            <div class="plan-card">
                <div class="plan-header">
                    <span>${formatPlanLabel(plan.plan)}</span>
                    <span class="plan-cost">${isFeasible ? formatPrice(plan.total_cost || 0) : '—'}</span>
                </div>
                <div class="plan-meta">${status}</div>
                ${summary.people ? `<div class="plan-meta">Số người: ${summary.people}, Số ngày: ${summary.days}</div>` : ''}
                ${isFeasible ? `<ul class="plan-list">${breakdownList || '<li>Không có chi tiết.</li>'}</ul>` : '<div class="plan-meta">Gợi ý: giảm số ngày, số người hoặc tăng ngân sách.</div>'}
                ${isFeasible && removed.length ? `<div class="plan-meta">Đã loại bỏ: ${removed.join(', ')}</div>` : ''}
            </div>
        `;
    }).join('');

    result.innerHTML = html;
}

function setCustomTourLoading(isLoading) {
    const loader = document.getElementById('customTourLoading');
    const result = document.getElementById('customTourResult');
    if (loader) loader.style.display = isLoading ? 'flex' : 'none';
    if (result) result.style.opacity = isLoading ? '0.4' : '1';
}

function setupCustomTourForm() {
    const form = document.getElementById('customTourForm');
    if (!form) return;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const budgetValue = Number(document.getElementById('customBudget')?.value || 0);
        const peopleValue = Number(document.getElementById('customPeople')?.value || 1);
        const daysValue = Number(document.getElementById('customDays')?.value || 1);
        const hotelStarValue = document.getElementById('customHotelStar')?.value || '';
        const preferenceValue = document.getElementById('customPreference')?.value || 'budget';
        const destinationSelect = document.getElementById('customDestinations');
        const destinationIds = destinationSelect ? Array.from(destinationSelect.selectedOptions).map(option => Number(option.value)) : [];

        if (!budgetValue || destinationIds.length === 0) {
            showToast('Vui lòng nhập ngân sách và chọn điểm đến.', 'error');
            return;
        }

        const payload = {
            budget: budgetValue,
            people: Math.max(1, peopleValue || 1),
            days: Math.max(1, daysValue || 1),
            destination_ids: destinationIds,
            hotel_star: hotelStarValue ? Number(hotelStarValue) : null,
            preference: preferenceValue
        };

        try {
            setCustomTourLoading(true);
            const response = await apiRequest('/custom-tours/estimate', {
                method: 'POST',
                body: JSON.stringify(payload)
            });

            if (response.success) {
                renderCustomPlans(response.data?.plans || [], response.data || {});
            } else {
                renderCustomPlans([]);
                showToast(response.message || 'Không thể tạo tour.', 'error');
            }
        } catch (error) {
            console.error('Custom tour error:', error);
            renderCustomPlans([]);
            showToast('Không thể tạo tour.', 'error');
        } finally {
            setCustomTourLoading(false);
        }
    });
}

// ===========================================
// Search Form Handler
// ===========================================

function initDatePicker() {
    const dateInput = document.getElementById('searchDepartureDate');
    const dateClear = document.getElementById('dateClear');
    
    if (!dateInput) return;
    
    flatpickrInstance = flatpickr(dateInput, {
        locale: 'vn',
        dateFormat: 'd/m/Y',
        minDate: 'today',
        disableMobile: true,
        onChange: function(selectedDates, dateStr) {
            if (dateClear) {
                dateClear.style.display = dateStr ? 'block' : 'none';
            }
        }
    });
    
    if (dateClear) {
        dateClear.addEventListener('click', () => {
            flatpickrInstance.clear();
            dateClear.style.display = 'none';
        });
    }
}

function handleSearchForm() {
    const form = document.getElementById('searchForm');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const keyword = document.getElementById('searchKeyword').value;
        const destinationId = document.getElementById('searchDestination').value;
        const departureDate = document.getElementById('searchDepartureDate')?.value;
        const departureLocation = document.getElementById('searchDeparture')?.value;
        
        let url = 'tour-list.html?';
        const params = [];
        
        if (keyword) {
            params.push(`search=${encodeURIComponent(keyword)}`);
        }
        
        if (destinationId) {
            params.push(`destination_id=${destinationId}`);
        }
        
        if (departureDate) {
            params.push(`departure_date=${encodeURIComponent(departureDate)}`);
        }
        
        if (departureLocation) {
            params.push(`departure_location=${encodeURIComponent(departureLocation)}`);
        }

        if (searchScope) {
            params.push(`scope=${searchScope}`);
        }
        
        url += params.join('&');
        window.location.href = url;
    });
}

function setupSearchTabs() {
    const tabs = document.querySelectorAll('[data-search-scope]');
    if (!tabs || tabs.length === 0) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const scope = tab.dataset.searchScope;
            if (!scope) return;
            searchScope = scope;
            tabs.forEach(btn => btn.classList.toggle('active', btn === tab));
            renderDestinationOptions();
        });
    });
}

function setupFeaturedTabs() {
    const domesticBtn = document.getElementById('btnFeaturedDomestic');
    const internationalBtn = document.getElementById('btnFeaturedInternational');
    if (!domesticBtn || !internationalBtn) return;

    domesticBtn.addEventListener('click', () => renderFeaturedToursForScope('domestic'));
    internationalBtn.addEventListener('click', () => renderFeaturedToursForScope('international'));
}

// ===========================================
// Regional Tours by Country/Region
// ===========================================

function getTourRegion(tour) {
    const country = normalizeCountry(tour?.destination_country || tour?.country);
    const destName = (tour?.destination_name || '').toLowerCase();
    
    for (const [region, countries] of Object.entries(regionCountries)) {
        if (countries.some(c => country.includes(c) || destName.includes(c))) {
            return region;
        }
    }
    return 'other';
}

async function loadRegionalTours() {
    try {
        showLoading('loadingRegional');
        
        const response = await apiRequest('/tours?limit=50');
        
        hideLoading('loadingRegional');
        
        if (response.success) {
            const allTours = response.data?.tours || response.data || [];
            renderRegionalTours(allTours, currentRegion);
        }
    } catch (error) {
        hideLoading('loadingRegional');
        console.error('Error loading regional tours:', error);
    }
}

function renderRegionalTours(allTours, region) {
    const grid = document.getElementById('regionalToursGrid');
    if (!grid) return;
    
    let filteredTours;
    
    if (region === 'domestic') {
        filteredTours = allTours.filter(tour => isDomesticTour(tour));
    } else {
        filteredTours = allTours.filter(tour => {
            const tourRegion = getTourRegion(tour);
            return tourRegion === region;
        });
    }
    
    if (filteredTours.length === 0) {
        grid.innerHTML = '<p class="text-center">Hiện chưa có tour cho khu vực này</p>';
        return;
    }
    
    grid.innerHTML = filteredTours.slice(0, 8).map(tour => createTourCard(tour)).join('');
}

function setupRegionalTabs() {
    const tabs = document.querySelectorAll('.regional-tab');
    if (!tabs.length) return;
    
    tabs.forEach(tab => {
        tab.addEventListener('click', async () => {
            const region = tab.dataset.region;
            if (!region) return;
            
            currentRegion = region;
            tabs.forEach(t => t.classList.toggle('active', t === tab));
            
            // Reload with new region
            await loadRegionalTours();
        });
    });
}

// ===========================================
// Scroll to Top Button
// ===========================================

function setupScrollToTop() {
    const scrollBtn = document.getElementById('scrollTopBtn');
    if (!scrollBtn) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });
    
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===========================================
// Initialize Homepage
// ===========================================

document.addEventListener('DOMContentLoaded', () => {
    // Init countdown timer
    initCountdown();
    
    // Init date picker
    initDatePicker();
    
    // Update social proof
    updateSocialProof();
    setInterval(updateSocialProof, 30000); // Update every 30 seconds
    
    // Setup tabs
    setupSearchTabs();
    setupFeaturedTabs();
    setupRegionalTabs();
    setupScrollToTop();
    
    // Load all sections
    loadFlashSaleTours();
    loadFeaturedTours();
    loadDestinations();
    loadSearchDestinations();
    loadRegionalTours();
    setupCustomTourForm();
    
    // Handle search form
    handleSearchForm();
});
})();

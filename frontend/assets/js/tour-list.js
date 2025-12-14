(() => {
const {
    apiRequest,
    formatPrice,
    showToast,
    showLoading,
    hideLoading,
    getQueryParam,
    getTourImage
} = window.TourBooking || {};

const tourListState = {
    filters: {
        search: getQueryParam('search') || '',
        destination_id: getQueryParam('destination_id') || '',
        min_price: getQueryParam('min_price') || '',
        max_price: getQueryParam('max_price') || '',
        duration: getQueryParam('duration') || '',
        scope: getQueryParam('scope') || '',
        has_discount: getQueryParam('has_discount') || '',
        sort_by: getQueryParam('sort_by') || 'newest'
    },
    page: Number(getQueryParam('page')) || 1,
    totalPages: 1,
    limit: 9,
    tours: [],
    currentView: 'grid',
    map: null,
    markers: []
};

function getElement(id) {
    return document.getElementById(id);
}

function buildQueryString() {
    const params = new URLSearchParams();
    params.set('page', tourListState.page);
    params.set('limit', tourListState.limit);

    Object.entries(tourListState.filters).forEach(([key, value]) => {
        if (value) {
            params.set(key, value);
        }
    });

    return params.toString();
}

function syncUrlParams() {
    const url = new URL(window.location);
    url.searchParams.set('page', tourListState.page);
    Object.entries(tourListState.filters).forEach(([key, value]) => {
        if (value) {
            url.searchParams.set(key, value);
        } else {
            url.searchParams.delete(key);
        }
    });
    window.history.replaceState({}, '', url);
}

async function loadDestinationsFilter() {
    const optionsContainer = getElement('destinationOptions');
    const hiddenInput = getElement('filterDestination');
    if (!optionsContainer) return;

    try {
        const res = await apiRequest('/destinations');
        if (!res.success) return;
        
        // Add destination options
        res.data.forEach(dest => {
            const option = document.createElement('div');
            option.className = 'custom-option';
            option.dataset.value = dest.destination_id;
            option.textContent = dest.name;
            optionsContainer.appendChild(option);
        });
        
        // Set initial value if exists
        if (tourListState.filters.destination_id && hiddenInput) {
            const selectedOption = optionsContainer.querySelector(`[data-value="${tourListState.filters.destination_id}"]`);
            if (selectedOption) {
                selectCustomOption(selectedOption);
            }
        }
        
        // Initialize custom select
        initCustomSelect();
    } catch (error) {
        console.error('loadDestinationsFilter error:', error);
    }
}

function initCustomSelect() {
    const customSelect = getElement('destinationSelect');
    const trigger = getElement('destinationTrigger');
    const options = getElement('destinationOptions');
    const hiddenInput = getElement('filterDestination');
    
    if (!customSelect || !trigger || !options) return;
    
    // Toggle dropdown
    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        customSelect.classList.toggle('open');
    });
    
    // Select option
    options.addEventListener('click', (e) => {
        const option = e.target.closest('.custom-option');
        if (option) {
            selectCustomOption(option);
            customSelect.classList.remove('open');
        }
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!customSelect.contains(e.target)) {
            customSelect.classList.remove('open');
        }
    });
}

function selectCustomOption(option) {
    const customSelect = getElement('destinationSelect');
    const trigger = getElement('destinationTrigger');
    const hiddenInput = getElement('filterDestination');
    const options = getElement('destinationOptions');
    
    // Remove selected from all
    options.querySelectorAll('.custom-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // Add selected to clicked option
    option.classList.add('selected');
    
    // Update trigger text
    trigger.querySelector('span').textContent = option.textContent;
    
    // Update hidden input
    if (hiddenInput) {
        hiddenInput.value = option.dataset.value;
    }
}

async function fetchTours() {
    showLoading('loadingTours');
    try {
        const res = await apiRequest(`/tours?${buildQueryString()}`);
        hideLoading('loadingTours');
        if (!res.success) return;
        const { tours, pagination } = res.data;
        tourListState.tours = tours;
        tourListState.totalPages = pagination.total_pages || 1;
        renderTours(tours);
        renderPagination(pagination);
        renderResultSummary(pagination.total_items);
        renderActiveFilters();
        
        // Update map if visible
        if (tourListState.currentView === 'map') {
            updateMapMarkers(tours);
        }
    } catch (error) {
        hideLoading('loadingTours');
        console.error('fetchTours error:', error);
        showToast('Không thể tải danh sách tour', 'error');
    }
}

function renderTours(tours) {
    const grid = getElement('toursGrid');
    const list = getElement('toursList');
    const empty = getElement('emptyTours');
    if (!grid || !empty) return;

    if (!tours || tours.length === 0) {
        grid.innerHTML = '';
        if (list) list.innerHTML = '';
        empty.style.display = 'block';
        return;
    }

    empty.style.display = 'none';
    const defaultImage = typeof getTourImage === 'function' ? getTourImage() : 'https://via.placeholder.com/400x250';
    
    // Render Grid View
    grid.innerHTML = tours.map(tour => renderTourCard(tour, defaultImage)).join('');
    
    // Render List View
    if (list) {
        list.innerHTML = tours.map(tour => renderTourListItem(tour, defaultImage)).join('');
    }
}

function renderTourCard(tour, defaultImage) {
    const imageSrc = typeof getTourImage === 'function' ? getTourImage(tour) : (tour.cover_image_url || defaultImage);
    // Random number for social proof (would come from database in real app)
    const bookingsLast24h = Math.floor(Math.random() * 15) + 3;
    const showSocialProof = Math.random() > 0.5; // Show on ~50% of tours
    
    return `
        <div class="tour-card" onclick="window.location.href='tour-detail.html?id=${tour.tour_id}'">
            <div class="tour-image">
                <img src="${imageSrc}" alt="${tour.title}" onerror="this.src='${defaultImage}'">
                ${tour.discount_percentage > 0 ? `<span class="tour-badge">-${tour.discount_percentage}%</span>` : ''}
                ${tour.avg_rating ? `<span class="tour-rating-badge"><i class="fas fa-star"></i> ${tour.avg_rating.toFixed(1)}</span>` : ''}
                ${showSocialProof ? `<span class="social-proof-badge"><i class="fas fa-fire"></i> ${bookingsLast24h} khách đặt 24h qua</span>` : ''}
            </div>
            <div class="tour-content">
                <h3>${tour.title}</h3>
                <div class="tour-departure-info">
                    <i class="fas fa-map-pin"></i>
                    <span>Khởi hành: TP. Hồ Chí Minh</span>
                </div>
                <div class="tour-meta">
                    <span><i class="fas fa-map-marker-alt"></i> ${tour.destination_name || 'Chưa xác định'}</span>
                    <span><i class="fas fa-clock"></i> ${tour.duration_days || 0}N${tour.duration_nights || 0}Đ</span>
                </div>
                <div class="tour-footer">
                    <div class="tour-price">
                        <div class="price-row">
                            <span class="price-amount">${formatPrice(tour.price_adult || 0)}</span>
                            ${tour.discount_percentage > 0 ? `<span class="discount-badge">-${tour.discount_percentage}%</span>` : ''}
                        </div>
                        ${tour.original_price ? `<span class="original-price">${formatPrice(tour.original_price)}</span>` : ''}
                    </div>
                    <button class="btn-book" type="button" onclick="event.stopPropagation(); window.location.href='tour-detail.html?id=${tour.tour_id}'">
                        Xem chi tiết
                    </button>
                </div>
            </div>
        </div>
    `;
}

function renderTourListItem(tour, defaultImage) {
    const imageSrc = typeof getTourImage === 'function' ? getTourImage(tour) : (tour.cover_image_url || defaultImage);
    const bookingsLast24h = Math.floor(Math.random() * 15) + 3;
    const showSocialProof = Math.random() > 0.5;
    
    return `
        <div class="tour-list-item" onclick="window.location.href='tour-detail.html?id=${tour.tour_id}'">
            <div class="tour-image">
                <img src="${imageSrc}" alt="${tour.title}" onerror="this.src='${defaultImage}'">
                ${tour.discount_percentage > 0 ? `<span class="tour-badge">-${tour.discount_percentage}%</span>` : ''}
                ${showSocialProof ? `<span class="social-proof-badge"><i class="fas fa-fire"></i> ${bookingsLast24h} khách đặt</span>` : ''}
            </div>
            <div class="tour-content">
                <h3>${tour.title}</h3>
                <div class="tour-departure-info">
                    <i class="fas fa-map-pin"></i>
                    <span>Khởi hành: TP. Hồ Chí Minh</span>
                </div>
                <p class="tour-description">${tour.short_description || tour.description?.slice(0, 200) || 'Khám phá những điểm đến tuyệt vời cùng chúng tôi!'}</p>
                <div class="tour-meta">
                    <span><i class="fas fa-map-marker-alt"></i> ${tour.destination_name || 'Chưa xác định'}</span>
                    <span><i class="fas fa-clock"></i> ${tour.duration_days || 0} ngày ${tour.duration_nights || 0} đêm</span>
                    ${tour.avg_rating ? `<span><i class="fas fa-star"></i> ${tour.avg_rating.toFixed(1)} (${tour.review_count || 0} đánh giá)</span>` : ''}
                </div>
                <div class="tour-footer">
                    <div class="tour-price">
                        <span class="price-amount">${formatPrice(tour.price_adult || 0)}</span>
                        ${tour.original_price ? `<span class="original-price">${formatPrice(tour.original_price)}</span>` : ''}
                    </div>
                    <button class="btn-book" type="button" onclick="event.stopPropagation(); window.location.href='tour-detail.html?id=${tour.tour_id}'">
                        Đặt tour ngay
                    </button>
                </div>
            </div>
        </div>
    `;
}

function renderPagination(pagination) {
    const container = getElement('paginationControls');
    if (!container) return;

    if (!pagination || tourListState.totalPages <= 1) {
        container.innerHTML = '';
        return;
    }

    const { current_page, total_pages } = pagination;
    let buttons = '';

    const createButton = (label, page, disabled = false, active = false) => `
        <button 
            data-page="${page}" 
            ${disabled ? 'disabled' : ''} 
            class="${active ? 'active' : ''}"
        >${label}</button>
    `;

    buttons += createButton('<i class="fas fa-chevron-left"></i>', current_page - 1, current_page === 1);

    const start = Math.max(1, current_page - 2);
    const end = Math.min(total_pages, start + 4);

    if (start > 1) {
        buttons += createButton(1, 1);
        if (start > 2) buttons += '<span class="pagination-dots">...</span>';
    }

    for (let page = start; page <= end; page++) {
        buttons += createButton(page, page, false, page === current_page);
    }

    if (end < total_pages) {
        if (end < total_pages - 1) buttons += '<span class="pagination-dots">...</span>';
        buttons += createButton(total_pages, total_pages);
    }

    buttons += createButton('<i class="fas fa-chevron-right"></i>', current_page + 1, current_page === total_pages);

    container.innerHTML = buttons;
}

function renderResultSummary(totalItems) {
    const summary = getElement('resultsSummary');
    if (!summary) return;
    const scopeText = tourListState.filters.scope === 'domestic' ? 'trong nước' : 
                      tourListState.filters.scope === 'international' ? 'quốc tế' : '';
    summary.innerHTML = `<i class="fas fa-list"></i> Tìm thấy <strong>${totalItems}</strong> tour ${scopeText}`;
}

function renderActiveFilters() {
    const container = getElement('activeFilters');
    if (!container) return;
    
    const filterLabels = {
        search: 'Từ khóa',
        min_price: 'Giá từ',
        max_price: 'Giá đến',
        duration: 'Thời gian',
        has_discount: 'Đang giảm giá'
    };
    
    let tags = '';
    Object.entries(tourListState.filters).forEach(([key, value]) => {
        if (value && key !== 'sort_by' && key !== 'scope' && key !== 'destination_id') {
            let displayValue = value;
            if (key === 'min_price' || key === 'max_price') {
                displayValue = formatPrice(value);
            }
            if (key === 'has_discount') {
                displayValue = 'Có';
            }
            tags += `
                <span class="active-filter-tag">
                    ${filterLabels[key] || key}: ${displayValue}
                    <i class="fas fa-times remove-filter" data-filter="${key}"></i>
                </span>
            `;
        }
    });
    
    container.innerHTML = tags;
    
    // Bind remove filter events
    container.querySelectorAll('.remove-filter').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const filterKey = e.target.dataset.filter;
            tourListState.filters[filterKey] = '';
            tourListState.page = 1;
            syncUrlParams();
            fetchTours();
            updateFilterUI();
        });
    });
}

// ================== VIEW TOGGLE ==================
function initViewToggle() {
    const viewBtns = document.querySelectorAll('.view-btn');
    const grid = getElement('toursGrid');
    const list = getElement('toursList');
    const mapContainer = getElement('toursMapContainer');
    
    viewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.dataset.view;
            tourListState.currentView = view;
            
            // Update active button
            viewBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Toggle views
            if (grid) grid.style.display = view === 'grid' ? 'grid' : 'none';
            if (list) list.style.display = view === 'list' ? 'flex' : 'none';
            if (mapContainer) {
                mapContainer.style.display = view === 'map' ? 'block' : 'none';
                if (view === 'map') {
                    initMap();
                    updateMapMarkers(tourListState.tours);
                }
            }
        });
    });
}

// ================== MAP VIEW ==================
function initMap() {
    if (tourListState.map) return; // Already initialized
    
    const mapElement = getElement('toursMap');
    if (!mapElement || typeof L === 'undefined') return;
    
    // Default center: Vietnam
    tourListState.map = L.map('toursMap').setView([16.0471, 108.2068], 6);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(tourListState.map);
}

function updateMapMarkers(tours) {
    if (!tourListState.map) return;
    
    // Clear existing markers
    tourListState.markers.forEach(marker => marker.remove());
    tourListState.markers = [];
    
    // Sample coordinates for destinations (in real app, get from database)
    const destinationCoords = {
        'Đà Nẵng': [16.0544, 108.2022],
        'Hà Nội': [21.0285, 105.8542],
        'Hồ Chí Minh': [10.8231, 106.6297],
        'Huế': [16.4637, 107.5909],
        'Nha Trang': [12.2388, 109.1967],
        'Phú Quốc': [10.2899, 103.9840],
        'Đà Lạt': [11.9404, 108.4583],
        'Sapa': [22.3364, 103.8438],
        'Hội An': [15.8801, 108.3380],
        'Hạ Long': [20.9517, 107.0454]
    };
    
    const defaultImage = typeof getTourImage === 'function' ? getTourImage() : 'https://via.placeholder.com/200x120';
    
    tours.forEach(tour => {
        const destName = tour.destination_name || '';
        let coords = null;
        
        // Find matching destination
        Object.keys(destinationCoords).forEach(key => {
            if (destName.toLowerCase().includes(key.toLowerCase())) {
                coords = destinationCoords[key];
            }
        });
        
        // If no match, use random offset from Vietnam center
        if (!coords) {
            coords = [
                16.0471 + (Math.random() - 0.5) * 10,
                108.2068 + (Math.random() - 0.5) * 10
            ];
        }
        
        const marker = L.marker(coords).addTo(tourListState.map);
        
        const popupContent = `
            <div class="map-popup">
                <h4>${tour.title}</h4>
                <p><i class="fas fa-map-marker-alt"></i> ${tour.destination_name || 'Việt Nam'}</p>
                <p><i class="fas fa-clock"></i> ${tour.duration_days || 0}N${tour.duration_nights || 0}Đ</p>
                <p class="price">${formatPrice(tour.price_adult || 0)}</p>
                <a href="tour-detail.html?id=${tour.tour_id}">Xem chi tiết</a>
            </div>
        `;
        
        marker.bindPopup(popupContent);
        tourListState.markers.push(marker);
    });
    
    // Fit bounds if there are markers
    if (tourListState.markers.length > 0) {
        const group = L.featureGroup(tourListState.markers);
        tourListState.map.fitBounds(group.getBounds().pad(0.1));
    }
}

// ================== SCOPE TABS ==================
function initScopeTabs() {
    const tabs = document.querySelectorAll('.scope-tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const scope = tab.dataset.scope;
            
            // Update active state
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Update filter and fetch
            tourListState.filters.scope = scope;
            tourListState.page = 1;
            syncUrlParams();
            fetchTours();
        });
    });
    
    // Set initial active tab from URL
    const currentScope = tourListState.filters.scope;
    tabs.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.scope === currentScope);
    });
}

// ================== QUICK FILTERS (CHIPS) ==================
function initQuickFilters() {
    const chips = document.querySelectorAll('.filter-chip');
    
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            const filterType = chip.dataset.filter;
            const value = chip.dataset.value;
            
            // Toggle chip active state
            const isActive = chip.classList.contains('active');
            
            // Deactivate other chips in same filter type
            document.querySelectorAll(`.filter-chip[data-filter="${filterType}"]`).forEach(c => {
                c.classList.remove('active');
            });
            
            if (!isActive) {
                chip.classList.add('active');
                applyQuickFilter(filterType, value);
            } else {
                clearQuickFilter(filterType);
            }
        });
    });
}

function applyQuickFilter(filterType, value) {
    switch (filterType) {
        case 'duration':
            tourListState.filters.duration = value;
            break;
        case 'price':
            if (value === 'budget') {
                tourListState.filters.min_price = '';
                tourListState.filters.max_price = '5000000';
            } else if (value === 'mid') {
                tourListState.filters.min_price = '5000000';
                tourListState.filters.max_price = '10000000';
            } else if (value === 'premium') {
                tourListState.filters.min_price = '10000000';
                tourListState.filters.max_price = '';
            }
            break;
        case 'discount':
            tourListState.filters.has_discount = value;
            break;
    }
    
    tourListState.page = 1;
    syncUrlParams();
    fetchTours();
    updateFilterUI();
}

function clearQuickFilter(filterType) {
    switch (filterType) {
        case 'duration':
            tourListState.filters.duration = '';
            break;
        case 'price':
            tourListState.filters.min_price = '';
            tourListState.filters.max_price = '';
            break;
        case 'discount':
            tourListState.filters.has_discount = '';
            break;
    }
    
    tourListState.page = 1;
    syncUrlParams();
    fetchTours();
    updateFilterUI();
}

// ================== FILTER PANEL TOGGLE ==================
function initFilterPanelToggle() {
    const toggle = getElement('filterToggle');
    const content = document.querySelector('.filter-form-content');
    const icon = getElement('filterToggleIcon');
    
    if (toggle && content && icon) {
        toggle.addEventListener('click', () => {
            content.classList.toggle('collapsed');
            // Toggle between up and down icons
            if (content.classList.contains('collapsed')) {
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            } else {
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            }
        });
    }
}

// ================== UPDATE FILTER UI ==================
function updateFilterUI() {
    const { filters } = tourListState;
    
    // Update form inputs
    const keywordInput = getElement('filterKeyword');
    const minPriceInput = getElement('filterMinPrice');
    const maxPriceInput = getElement('filterMaxPrice');
    const durationSelect = getElement('filterDuration');
    
    if (keywordInput) keywordInput.value = filters.search;
    if (minPriceInput) minPriceInput.value = filters.min_price;
    if (maxPriceInput) maxPriceInput.value = filters.max_price;
    if (durationSelect) durationSelect.value = filters.duration;
    
    // Update quick filter chips
    document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.classList.remove('active');
    });
    
    if (filters.duration) {
        document.querySelector(`.filter-chip[data-filter="duration"][data-value="${filters.duration}"]`)?.classList.add('active');
    }
    
    if (filters.has_discount === 'true') {
        document.querySelector('.filter-chip[data-filter="discount"]')?.classList.add('active');
    }
    
    // Price chips
    if (filters.max_price === '5000000' && !filters.min_price) {
        document.querySelector('.filter-chip[data-value="budget"]')?.classList.add('active');
    } else if (filters.min_price === '5000000' && filters.max_price === '10000000') {
        document.querySelector('.filter-chip[data-value="mid"]')?.classList.add('active');
    } else if (filters.min_price === '10000000' && !filters.max_price) {
        document.querySelector('.filter-chip[data-value="premium"]')?.classList.add('active');
    }
}

function bindFilterEvents() {
    const form = getElement('filterForm');
    const clearBtn = getElement('btnClearFilters');
    const sortSelect = getElement('sortSelect');
    const pagination = getElement('paginationControls');
    const resetFromEmpty = getElement('btnResetFromEmpty');

    if (form) {
        form.addEventListener('submit', event => {
            event.preventDefault();
            tourListState.filters.search = getElement('filterKeyword')?.value.trim() || '';
            tourListState.filters.destination_id = getElement('filterDestination')?.value || '';
            tourListState.filters.min_price = getElement('filterMinPrice')?.value || '';
            tourListState.filters.max_price = getElement('filterMaxPrice')?.value || '';
            tourListState.filters.duration = getElement('filterDuration')?.value || '';
            tourListState.page = 1;
            syncUrlParams();
            fetchTours();
        });
    }

    const clearFilters = () => {
        if (form) form.reset();
        const currentScope = tourListState.filters.scope;
        tourListState.filters = {
            search: '',
            destination_id: '',
            min_price: '',
            max_price: '',
            duration: '',
            scope: currentScope,
            has_discount: '',
            sort_by: 'newest'
        };
        tourListState.page = 1;
        
        // Clear chip active states
        document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
        
        syncUrlParams();
        fetchTours();
        updateFilterUI();
    };

    clearBtn?.addEventListener('click', clearFilters);
    resetFromEmpty?.addEventListener('click', clearFilters);

    sortSelect?.addEventListener('change', event => {
        tourListState.filters.sort_by = event.target.value;
        tourListState.page = 1;
        syncUrlParams();
        fetchTours();
    });

    pagination?.addEventListener('click', event => {
        const btn = event.target.closest('button');
        if (!btn || btn.disabled) return;
        
        const page = Number(btn.dataset.page);
        if (!Number.isNaN(page) && page >= 1 && page <= tourListState.totalPages) {
            tourListState.page = page;
            syncUrlParams();
            fetchTours();
            
            // Scroll to top of results
            getElement('resultsSummary')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
}

function initFilterValues() {
    const keywordInput = getElement('filterKeyword');
    const minPriceInput = getElement('filterMinPrice');
    const maxPriceInput = getElement('filterMaxPrice');
    const sortSelect = getElement('sortSelect');
    const durationSelect = getElement('filterDuration');
    
    if (keywordInput) keywordInput.value = tourListState.filters.search;
    if (minPriceInput) minPriceInput.value = tourListState.filters.min_price;
    if (maxPriceInput) maxPriceInput.value = tourListState.filters.max_price;
    if (sortSelect) sortSelect.value = tourListState.filters.sort_by;
    if (durationSelect) durationSelect.value = tourListState.filters.duration || '';
    
    // Set initial quick filter chip states
    updateFilterUI();
}

function initTourListPage() {
    if (!window.TourBooking) {
        console.error('TourBooking helpers missing');
        return;
    }

    initFilterValues();
    initScopeTabs();
    initQuickFilters();
    initViewToggle();
    initFilterPanelToggle();
    bindFilterEvents();
    loadDestinationsFilter();
    initDatePicker();
    initFloatingButtons();
    fetchTours();
}

// ================== DATE PICKER ==================
function initDatePicker() {
    const dateInput = getElement('filterDepartureDate');
    if (dateInput && typeof flatpickr !== 'undefined') {
        flatpickr(dateInput, {
            locale: 'vn',
            dateFormat: 'd/m/Y',
            minDate: 'today',
            allowInput: true,
            placeholder: 'Chọn ngày khởi hành'
        });
    }
}

// ================== FLOATING BUTTONS ==================
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

document.addEventListener('DOMContentLoaded', initTourListPage);
})();

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
        sort_by: getQueryParam('sort_by') || 'newest'
    },
    page: Number(getQueryParam('page')) || 1,
    totalPages: 1,
    limit: 9,
    tours: []
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
    const select = getElement('filterDestination');
    if (!select) return;

    try {
        const res = await apiRequest('/destinations');
        if (!res.success) return;
        res.data.forEach(dest => {
            const option = document.createElement('option');
            option.value = dest.destination_id;
            option.textContent = dest.name;
            select.appendChild(option);
        });
        select.value = tourListState.filters.destination_id || '';
    } catch (error) {
        console.error('loadDestinationsFilter error:', error);
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
    } catch (error) {
        hideLoading('loadingTours');
        console.error('fetchTours error:', error);
        showToast('Không thể tải danh sách tour', 'error');
    }
}

function renderTours(tours) {
    const grid = getElement('toursGrid');
    const empty = getElement('emptyTours');
    if (!grid || !empty) return;

    if (!tours || tours.length === 0) {
        grid.innerHTML = '';
        empty.style.display = 'block';
        return;
    }

    empty.style.display = 'none';
    const defaultImage = typeof getTourImage === 'function' ? getTourImage() : 'https://via.placeholder.com/400x250';
    grid.innerHTML = tours
        .map(tour => {
            const imageSrc = typeof getTourImage === 'function' ? getTourImage(tour) : (tour.cover_image_url || defaultImage);
            return `
            <div class="tour-card" onclick="window.location.href='tour-detail.html?id=${tour.tour_id}'">
                <img src="${imageSrc}" alt="${tour.title}" onerror="this.src='${defaultImage}'">
                <div class="tour-content">
                    <h3>${tour.title}</h3>
                    <div class="tour-info">
                        <span><i class="fas fa-map-marker-alt"></i> ${tour.destination_name || ''}</span>
                        <span><i class="fas fa-clock"></i> ${tour.duration_days || 0}N${tour.duration_nights || 0}Đ</span>
                    </div>
                    <p class="tour-description">${tour.short_description || tour.description?.slice(0, 120) || ''}</p>
                    <div class="tour-footer">
                        <div class="tour-price">
                            <div class="price-row">
                                <span class="price-amount">${formatPrice(tour.price_adult || 0)}</span>
                                ${tour.discount_percentage > 0 ? `<span class="discount-badge">-${tour.discount_percentage}%</span>` : ''}
                            </div>
                            ${tour.original_price ? `<span class="original-price">${formatPrice(tour.original_price)}</span>` : ''}
                        </div>
                        <button class="btn-outline btn-full" type="button">Xem tour</button>
                    </div>
                </div>
            </div>
        `;
        })
        .join('');
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

    buttons += createButton('<', current_page - 1, current_page === 1);

    const start = Math.max(1, current_page - 2);
    const end = Math.min(total_pages, start + 4);

    for (let page = start; page <= end; page++) {
        buttons += createButton(page, page, false, page === current_page);
    }

    buttons += createButton('>', current_page + 1, current_page === total_pages);

    container.innerHTML = buttons;
}

function renderResultSummary(totalItems) {
    const summary = getElement('resultsSummary');
    if (!summary) return;
    summary.textContent = `Hiển thị trang ${tourListState.page} / ${tourListState.totalPages} - ${totalItems} tour`;
}

function bindFilterEvents() {
    const form = getElement('filterForm');
    const clearBtn = getElement('btnClearFilters');
    const sortSelect = getElement('sortSelect');
    const pagination = getElement('paginationControls');

    if (form) {
        form.addEventListener('submit', event => {
            event.preventDefault();
            tourListState.filters.search = getElement('filterKeyword').value.trim();
            tourListState.filters.destination_id = getElement('filterDestination').value;
            tourListState.filters.min_price = getElement('filterMinPrice').value;
            tourListState.filters.max_price = getElement('filterMaxPrice').value;
            tourListState.page = 1;
            syncUrlParams();
            fetchTours();
        });
    }

    clearBtn?.addEventListener('click', () => {
        form.reset();
        tourListState.filters = {
            search: '',
            destination_id: '',
            min_price: '',
            max_price: '',
            sort_by: 'newest'
        };
        tourListState.page = 1;
        syncUrlParams();
        fetchTours();
    });

    sortSelect?.addEventListener('change', event => {
        tourListState.filters.sort_by = event.target.value;
        tourListState.page = 1;
        syncUrlParams();
        fetchTours();
    });

    pagination?.addEventListener('click', event => {
        if (event.target.tagName !== 'BUTTON' || event.target.disabled) {
            return;
        }
        const page = Number(event.target.dataset.page);
        if (!Number.isNaN(page) && page >= 1 && page <= tourListState.totalPages) {
            tourListState.page = page;
            syncUrlParams();
            fetchTours();
        }
    });
}

function initFilterValues() {
    getElement('filterKeyword').value = tourListState.filters.search;
    getElement('filterMinPrice').value = tourListState.filters.min_price;
    getElement('filterMaxPrice').value = tourListState.filters.max_price;
    getElement('sortSelect').value = tourListState.filters.sort_by;
}

function initTourListPage() {
    if (!window.TourBooking) {
        console.error('TourBooking helpers missing');
        return;
    }

    initFilterValues();
    bindFilterEvents();
    loadDestinationsFilter();
    fetchTours();
}

document.addEventListener('DOMContentLoaded', initTourListPage);
})();

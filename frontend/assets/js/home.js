// ===========================================
// Homepage JavaScript
// ===========================================

(() => {
const { apiRequest, formatPrice, showToast, showLoading, hideLoading, getDestinationImage, getTourImage } = window.TourBooking;

const getRatingScore = value => {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric.toFixed(1) : '5.0';
};

const normalizePrice = value => {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : 0;
};

// ===========================================
// Load Featured Tours
// ===========================================

async function loadFeaturedTours() {
    try {
        showLoading('loadingFeatured');
        
        const response = await apiRequest('/tours/featured?limit=8');
        
        hideLoading('loadingFeatured');
        
        if (response.success) {
            renderFeaturedTours(response.data);
        }
    } catch (error) {
        hideLoading('loadingFeatured');
        console.error('Error loading featured tours:', error);
        showToast('Không thể tải tour nổi bật', 'error');
    }
}

function renderFeaturedTours(tours) {
    const grid = document.getElementById('featuredToursGrid');
    if (!grid) return;
    
    if (tours.length === 0) {
        grid.innerHTML = '<p class="text-center">Không có tour nào</p>';
        return;
    }
    
    grid.innerHTML = tours.map(tour => `
        <div class="tour-card" onclick="window.location.href='tour-detail.html?id=${tour.tour_id}'">
            <div class="tour-image">
                <img src="${getTourImage(tour)}" 
                     alt="${tour.title}"
                     onerror="this.src='${getTourImage()}'">
                ${tour.discount_percentage > 0 ? `<span class="tour-badge">-${tour.discount_percentage}%</span>` : ''}
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
    `).join('');
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
    
    grid.innerHTML = destinations.map(dest => `
        <div class="destination-card" onclick="window.location.href='tour-list.html?destination_id=${dest.destination_id}'">
              <img src="${getDestinationImage(dest)}" 
                 alt="${dest.name}"
                  onerror="this.src='${getDestinationImage()}'">
            <div class="destination-info">
                <h3 class="destination-name">${dest.name}</h3>
                <p class="destination-count">${dest.tour_count || 0} tour</p>
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
            populateDestinationSelect(response.data);
        }
    } catch (error) {
        console.error('Error loading search destinations:', error);
    }
}

function populateDestinationSelect(destinations) {
    const select = document.getElementById('searchDestination');
    if (!select) return;
    
    destinations.forEach(dest => {
        const option = document.createElement('option');
        option.value = dest.destination_id;
        option.textContent = dest.name;
        select.appendChild(option);
    });
}

// ===========================================
// Search Form Handler
// ===========================================

function handleSearchForm() {
    const form = document.getElementById('searchForm');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const keyword = document.getElementById('searchKeyword').value;
        const destinationId = document.getElementById('searchDestination').value;
        
        let url = 'tour-list.html?';
        const params = [];
        
        if (keyword) {
            params.push(`search=${encodeURIComponent(keyword)}`);
        }
        
        if (destinationId) {
            params.push(`destination_id=${destinationId}`);
        }
        
        url += params.join('&');
        window.location.href = url;
    });
}

// ===========================================
// Initialize Homepage
// ===========================================

document.addEventListener('DOMContentLoaded', () => {
    loadFeaturedTours();
    loadDestinations();
    loadSearchDestinations();
    handleSearchForm();
});
})();

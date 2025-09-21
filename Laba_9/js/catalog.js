document.addEventListener('DOMContentLoaded', function () {
    const API_BASE_URL = 'http://localhost:3000';
    const ITEMS_PER_PAGE = 6;

    const catalogContainer = document.getElementById('catalog-container');
    const paginationContainer = document.getElementById('pagination-container');
    const searchInput = document.getElementById('search-input');
    const categorySelect = document.getElementById('category-select');
    const sortSelect = document.getElementById('sort-select');
    const priceMinInput = document.getElementById('price-min');
    const priceMaxInput = document.getElementById('price-max');
    const coverageMinInput = document.getElementById('coverage-min');
    const coverageMaxInput = document.getElementById('coverage-max');
    const applyFiltersButton = document.getElementById('btn-apply-filters');
    const resetButton = document.getElementById('btn-reset');

    const detailsModal = document.getElementById('plan-details-modal');

    let currentPage = 1;
    let totalPages = 1;
    let currentFilters = {};

    if (detailsModal) {
        const closeModalBtn = detailsModal.querySelector('.modal__close');
        closeModalBtn.addEventListener('click', () => detailsModal.classList.remove('active'));
        detailsModal.addEventListener('click', (e) => {
            if (e.target === detailsModal) {
                detailsModal.classList.remove('active');
            }
        });
    }

    async function renderCatalog(plans) {
        if (!catalogContainer) return;
        catalogContainer.innerHTML = '';

        if (!plans || plans.length === 0) {
            catalogContainer.innerHTML = '<div class="not-found-message">Sorry, no plans were found matching your criteria. Please try adjusting the filters.</div>';
            return;
        }

        const favoritesResponse = await fetch(`${API_BASE_URL}/favorites`);
        const favorites = await favoritesResponse.json();
        const cartResponse = await fetch(`${API_BASE_URL}/cart`);
        const cart = await cartResponse.json();

        plans.forEach(plan => {
            const isFavorite = favorites.some(fav => fav.id === plan.id);
            const isInCart = cart.some(cartItem => cartItem.id === plan.id);

            const card = document.createElement('div');
            card.className = 'plan-card';
            card.innerHTML = `
                <img src="${plan.image || 'https://placehold.co/600x400/43806C/FFFFFF?text=Info'}" alt="${plan.name || 'Plan'}" class="plan-card__image">
                ${plan.tier ? `<span class="plan-card__tier plan-card__tier--${plan.tier}">${plan.tier.charAt(0).toUpperCase() + plan.tier.slice(1)}</span>` : ''}
                <div class="plan-card__content">
                    <span class="plan-card__category">${plan.type || 'Unknown'}</span>
                    <h3 class="plan-card__title">${plan.name || 'Unnamed Plan'}</h3>
                    <p class="plan-card__description">${plan.description || 'No description available.'}</p>
                    <div class="plan-card__footer">
                        ${plan.coverage ? `<span class="plan-card__coverage">Coverage: <strong>$${plan.coverage.toLocaleString()}</strong></span>` : ''}
                        ${plan.rating ? `<span class="plan-card__rating">Rating: <strong>${plan.rating.toFixed(1)}</strong></span>` : ''}
                        ${plan.price ? `<span class="plan-card__fee">Price: <strong>$${plan.price}</strong>/mo</span>` : ''}
                    </div>
                    <div class="plan-card__actions">
                        <button class="add-to-favorites-btn" data-id="${plan.id}" ${isFavorite ? 'disabled' : ''}>${isFavorite ? 'In Favorites' : 'Add to Favorites'}</button>
                        <button class="add-to-cart-btn" data-id="${plan.id}" ${isInCart ? 'disabled' : ''}>${isInCart ? 'In Cart' : 'Add to Cart'}</button>
                    </div>
                </div>
            `;
            catalogContainer.appendChild(card);
            
            card.addEventListener('click', (e) => {
                if (!e.target.closest('button')) {
                    openDetailsModal(plan.id);
                }
            });
        });

        document.querySelectorAll('.add-to-favorites-btn').forEach(button => button.addEventListener('click', handleAddToFavorites));
        document.querySelectorAll('.add-to-cart-btn').forEach(button => button.addEventListener('click', handleAddToCart));
    }

    function buildQueryUrl(page) {
        const url = new URL(`${API_BASE_URL}/plans`);
        url.searchParams.append('_page', page);
        url.searchParams.append('_limit', ITEMS_PER_PAGE);

        if (currentFilters.search) url.searchParams.append('q', currentFilters.search);
        if (currentFilters.category && currentFilters.category !== 'all') url.searchParams.append('type', currentFilters.category);
        if (currentFilters.sortBy && currentFilters.sortBy !== 'default') {
            const [field, order] = currentFilters.sortBy.split('-');
            url.searchParams.append('_sort', field);
            url.searchParams.append('_order', order);
        }
        if (currentFilters.priceMin) url.searchParams.append('price_gte', currentFilters.priceMin);
        if (currentFilters.priceMax) url.searchParams.append('price_lte', currentFilters.priceMax);
        if (currentFilters.coverageMin) url.searchParams.append('coverage_gte', currentFilters.coverageMin);
        if (currentFilters.coverageMax) url.searchParams.append('coverage_lte', currentFilters.coverageMax);
        return url.toString();
    }

    async function fetchDataAndRender() {
        const url = buildQueryUrl(currentPage);
        try {
            const response = await fetch(url);
            const totalCount = parseInt(response.headers.get('X-Total-Count') || '0');
            totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
            const plans = await response.json();
            await renderCatalog(plans);
            renderPagination();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.error('Error fetching plans:', error);
            catalogContainer.innerHTML = '<div class="not-found-message">Error loading data.</div>';
        }
    }

    function renderPagination() {
        if (!paginationContainer) return;
        paginationContainer.innerHTML = '';
        if (totalPages <= 1) return;

        const createButton = (text, page, disabled = false) => {
            const button = document.createElement('button');
            button.textContent = text;
            button.disabled = disabled;
            button.addEventListener('click', () => {
                currentPage = page;
                fetchDataAndRender();
            });
            return button;
        };
        
        paginationContainer.appendChild(createButton('Previous', currentPage - 1, currentPage === 1));
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = createButton(i, i);
            if (i === currentPage) pageButton.classList.add('active');
            paginationContainer.appendChild(pageButton);
        }
        paginationContainer.appendChild(createButton('Next', currentPage + 1, currentPage === totalPages));
    }

    async function populateCategories() {
        try {
            const response = await fetch(`${API_BASE_URL}/plans`);
            const plans = await response.json();
            const categories = [...new Set(plans.map(plan => plan.type))];
            if (categorySelect) {
                categorySelect.innerHTML = '<option value="all">All Categories</option>';
                categories.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category;
                    option.textContent = category;
                    categorySelect.appendChild(option);
                });
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    }

    async function handleAddToFavorites(event) {
        const planId = parseInt(event.target.dataset.id);
        try {
            const response = await fetch(`${API_BASE_URL}/plans/${planId}`);
            if (!response.ok) throw new Error('Plan not found');
            const plan = await response.json();
            
            await fetch(`${API_BASE_URL}/favorites`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(plan)
            });
            
            event.target.textContent = 'In Favorites';
            event.target.disabled = true;
            showToast(`"${plan.name}" added to favorites!`, 'success');
        } catch (error) {
            console.error('Error adding to favorites:', error);
            showToast('Error adding to favorites.', 'error');
        }
    }
    
    async function handleAddToCart(event) {
        const planId = parseInt(event.target.dataset.id);
        try {
            const response = await fetch(`${API_BASE_URL}/plans/${planId}`);
            if (!response.ok) throw new Error('Plan not found');
            const plan = await response.json();
            
            await fetch(`${API_BASE_URL}/cart`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(plan)
            });
            
            event.target.textContent = 'In Cart';
            event.target.disabled = true;
            showToast(`"${plan.name}" added to cart!`, 'success');
        } catch (error) {
            console.error('Error adding to cart:', error);
            showToast('Error adding to cart.', 'error');
        }
    }

    async function openDetailsModal(planId) {
        if (!detailsModal) return;
        try {
            const response = await fetch(`${API_BASE_URL}/plans/${planId}`);
            if (!response.ok) throw new Error('Plan not found');
            const plan = await response.json();

            document.getElementById('details-modal-title').textContent = plan.name;
            document.getElementById('details-modal-image').src = plan.image;
            document.getElementById('details-modal-description').textContent = plan.description;
            document.getElementById('details-modal-coverage').textContent = `Coverage: $${plan.coverage.toLocaleString()}`;
            document.getElementById('details-modal-price').textContent = `Price: $${plan.price}/mo`;

            detailsModal.classList.add('active');
        } catch (error) {
            console.error('Failed to fetch plan details:', error);
            showToast('Could not load plan details.', 'error');
        }
    }

    function updateFilters() {
        currentFilters = {
            search: searchInput.value.toLowerCase(),
            category: categorySelect.value,
            sortBy: sortSelect.value,
            priceMin: parseFloat(priceMinInput.value) || null,
            priceMax: parseFloat(priceMaxInput.value) || null,
            coverageMin: parseFloat(coverageMinInput.value) || null,
            coverageMax: parseFloat(coverageMaxInput.value) || null
        };
        currentPage = 1;
        fetchDataAndRender();
    }

    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    if (searchInput) searchInput.addEventListener('input', debounce(updateFilters, 300));
    if (categorySelect) categorySelect.addEventListener('change', updateFilters);
    if (sortSelect) sortSelect.addEventListener('change', updateFilters);
    if (applyFiltersButton) applyFiltersButton.addEventListener('click', updateFilters);
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            if (categorySelect) categorySelect.value = 'all';
            if (sortSelect) sortSelect.value = 'default';
            if (priceMinInput) priceMinInput.value = '';
            if (priceMaxInput) priceMaxInput.value = '';
            if (coverageMinInput) coverageMinInput.value = '';
            if (coverageMaxInput) coverageMaxInput.value = '';
            currentFilters = {};
            currentPage = 1;
            fetchDataAndRender();
        });
    }

    populateCategories();
    fetchDataAndRender();
});
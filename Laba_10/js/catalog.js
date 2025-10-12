document.addEventListener('DOMContentLoaded', () => {

    const API_BASE_URL = 'http://localhost:3000';
    const ITEMS_PER_PAGE = 6;

    let allPlans = [];
    let filteredPlans = []; 
    let currentUser = null;
    let userFavorites = [];
    let userCart = [];
    let i18nData = {}; 
    let currentPage = 1;

    const catalogContainer = document.getElementById('catalog-container');
    const paginationContainer = document.getElementById('pagination-container');
    const searchInput = document.getElementById('search-input');
    const categorySelect = document.getElementById('category-select');
    const sortSelect = document.getElementById('sort-select');
    const coverageMinInput = document.getElementById('coverage-min');
    const coverageMaxInput = document.getElementById('coverage-max');
    const priceMinInput = document.getElementById('price-min');
    const priceMaxInput = document.getElementById('price-max');
    const applyFiltersBtn = document.getElementById('btn-apply-filters');
    const resetBtn = document.getElementById('btn-reset');

    async function initializeCatalog() {
        currentUser = JSON.parse(localStorage.getItem('currentUser'));
        try {
            const response = await fetch('./translate.json');
            i18nData = await response.json();
        } catch (error) {
            console.error("Could not load translations:", error);
        }
        await Promise.all([
            fetchPlans(),
            fetchUserFavorites(),
            fetchUserCart()
        ]);
        
        setupEventListeners();
        applyFiltersAndSort(); 
    }

    async function fetchPlans() {
        try {
            const response = await fetch(`${API_BASE_URL}/plans`);
            if (!response.ok) throw new Error('Network response was not ok');
            allPlans = await response.json();
            filteredPlans = [...allPlans];
        } catch (error) {
            console.error('Failed to fetch plans:', error);
            catalogContainer.innerHTML = `<p class="error-message">Could not load plans. Please try again later.</p>`;
        }
    }

    async function fetchUserFavorites() {
        if (!currentUser) return;
        try {
            const response = await fetch(`${API_BASE_URL}/favorites?userId=${currentUser.id}`);
            userFavorites = await response.json();
        } catch (error) {
            console.error('Failed to fetch favorites:', error);
        }
    }

    async function fetchUserCart() {
        if (!currentUser) return;
        try {
            const response = await fetch(`${API_BASE_URL}/cart?userId=${currentUser.id}`);
            userCart = await response.json();
        } catch (error) {
            console.error('Failed to fetch cart:', error);
        }
    }

    function renderPage() {
        displayCurrentPagePlans();
        renderPaginationControls();
    }
    
    function displayCurrentPagePlans() {
        catalogContainer.innerHTML = '';
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const plansForPage = filteredPlans.slice(startIndex, endIndex);

        if (plansForPage.length === 0 && allPlans.length > 0) {
            const noPlansMessage = i18nData[localStorage.getItem('lang') || 'en']?.noPlansFound || 'No plans found matching your criteria.';
            catalogContainer.innerHTML = `<p class="info-message">${noPlansMessage}</p>`;
        } else {
             plansForPage.forEach(plan => {
                const card = renderPlanCard(plan);
                catalogContainer.appendChild(card);
            });
        }
    }

    function renderPaginationControls() {
        paginationContainer.innerHTML = '';
        const totalPages = Math.ceil(filteredPlans.length / ITEMS_PER_PAGE);

        if (totalPages > 1) {
            for (let i = 1; i <= totalPages; i++) {
                const button = document.createElement('button');
                button.textContent = i;
                button.className = 'pagination-btn';
                if (i === currentPage) {
                    button.classList.add('active');
                }
                button.addEventListener('click', () => {
                    currentPage = i;
                    renderPage();
                });
                paginationContainer.appendChild(button);
            }
        }
    }
    
    function renderPlanCard(plan) {
        const currentLang = localStorage.getItem('lang') || 'en';
        const planName = i18nData[currentLang]?.[`plan_${plan.id}_name`] || plan.name;
        const planDescription = i18nData[currentLang]?.[`plan_${plan.id}_desc`] || plan.description;

        const isFavorite = userFavorites.some(fav => fav.planId === plan.id);
        const isInCart = userCart.some(item => item.planId === plan.id);
        
        const addToFavText = i18nData[currentLang]?.addToFavorites || 'Add to Favorites';
        const inFavText = i18nData[currentLang]?.inFavorites || 'In Favorites';
        const addToCartText = i18nData[currentLang]?.addToCart || 'Add to Cart';
        const inCartText = i18nData[currentLang]?.inCart || 'In Cart';
        
        const card = document.createElement('div');
        card.className = 'plan-card';
        card.dataset.planId = plan.id;

        card.innerHTML = `
            <img src="${plan.image}" alt="${planName}" class="plan-card__image">
            <div class="plan-card__content">
                <h3 class="plan-card__title">${planName}</h3>
                <p class="plan-card__description">${planDescription}</p>
                <div class="plan-card__meta">
                    <span>${i18nData[currentLang]?.cardCoverage || 'Coverage'}: $${plan.coverage.toLocaleString()}</span>
                    <span>${i18nData[currentLang]?.cardRating || 'Rating'}: ${plan.rating} ★</span>
                </div>
                <div class="plan-card__price">${i18nData[currentLang]?.cardPrice || 'Price'}: $${plan.price}/mo</div>
                <div class="plan-card__actions">
                    <button class="action-btn favorite-btn ${isFavorite ? 'active' : ''}" ${!currentUser ? 'disabled' : ''}>
                        ${isFavorite ? inFavText : addToFavText}
                    </button>
                    <button class="action-btn cart-btn ${isInCart ? 'active' : ''}" ${!currentUser ? 'disabled' : ''}>
                        ${isInCart ? inCartText : addToCartText}
                    </button>
                </div>
            </div>
        `;
        return card;
    }
    
    function applyFiltersAndSort() {
        let tempPlans = [...allPlans];
        const searchTerm = searchInput.value.toLowerCase();
        if (searchTerm) {
            const currentLang = localStorage.getItem('lang') || 'en';
            tempPlans = tempPlans.filter(plan => {
                 const planName = i18nData[currentLang]?.[`plan_${plan.id}_name`] || plan.name;
                 const planDescription = i18nData[currentLang]?.[`plan_${plan.id}_desc`] || plan.description;
                 return planName.toLowerCase().includes(searchTerm) || planDescription.toLowerCase().includes(searchTerm);
            });
        }
        
        const minPrice = parseFloat(priceMinInput.value) || 0;
        const maxPrice = parseFloat(priceMaxInput.value) || Infinity;
        const minCoverage = parseFloat(coverageMinInput.value) || 0;
        const maxCoverage = parseFloat(coverageMaxInput.value) || Infinity;

        tempPlans = tempPlans.filter(plan => 
            plan.price >= minPrice && plan.price <= maxPrice &&
            plan.coverage >= minCoverage && plan.coverage <= maxCoverage
        );
        
        const sortBy = sortSelect.value;
        tempPlans.sort((a, b) => {
            switch (sortBy) {
                case 'price-asc': return a.price - b.price;
                case 'price-desc': return b.price - a.price;
                case 'name-asc': return a.name.localeCompare(b.name);
                case 'name-desc': return b.name.localeCompare(a.name);
                case 'rating-desc': return b.rating - a.rating;
                case 'rating-asc': return a.rating - b.rating;
                default: return 0;
            }
        });

        filteredPlans = tempPlans;
        currentPage = 1; 
        renderPage(); 
    }
    

    function setupEventListeners() {
        applyFiltersBtn.addEventListener('click', applyFiltersAndSort);
        searchInput.addEventListener('input', applyFiltersAndSort);
        sortSelect.addEventListener('change', applyFiltersAndSort);

        resetBtn.addEventListener('click', () => {
            searchInput.value = '';
            sortSelect.value = 'default';
            priceMinInput.value = '';
            priceMaxInput.value = '';
            coverageMinInput.value = '';
            coverageMaxInput.value = '';
            applyFiltersAndSort();
        });

        catalogContainer.addEventListener('click', handleCardAction);
    }
    
    async function handleCardAction(event) {
        if (!currentUser) return;
        
        const target = event.target;
        const card = target.closest('.plan-card');
        if (!card) return;

        const planId = parseInt(card.dataset.planId, 10);
        
        if (target.classList.contains('favorite-btn')) {
            await toggleFavorite(planId, target);
        }
    }

    async function toggleFavorite(planId, button) {
        const favoriteRecord = userFavorites.find(fav => fav.planId === planId);
        const currentLang = localStorage.getItem('lang') || 'en';
        const inFavText = i18nData[currentLang]?.inFavorites || 'In Favorites';
        const addToFavText = i18nData[currentLang]?.addToFavorites || 'Add to Favorites';

        try {
            if (favoriteRecord) {
                await fetch(`${API_BASE_URL}/favorites/${favoriteRecord.id}`, { method: 'DELETE' });
                userFavorites = userFavorites.filter(fav => fav.id !== favoriteRecord.id);
                button.classList.remove('active');
                button.textContent = addToFavText;
            } else {
                const newFavorite = { userId: currentUser.id, planId };
                const response = await fetch(`${API_BASE_URL}/favorites`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newFavorite)
                });
                const addedFavorite = await response.json();
                userFavorites.push(addedFavorite);
                button.classList.add('active');
                button.textContent = inFavText;
            }
        } catch (error) {
            console.error('Failed to toggle favorite status:', error);
            alert('An error occurred. Please try again.');
        }
    }
    
    initializeCatalog();
});
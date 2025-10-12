document.addEventListener('DOMContentLoaded', () => {

    const API_BASE_URL = 'http://localhost:3000';
    let currentUser = null;
    let i18nData = {};

    const favoritesContainer = document.getElementById('favorites-container');

    async function initializeFavorites() {
        currentUser = JSON.parse(localStorage.getItem('currentUser'));

        try {
            const response = await fetch('./translate.json');
            i18nData = await response.json();
        } catch (error) {
            console.error("Could not load translations:", error);
        }

        displayFavoritePlans();
    }

    function renderPlanCard(plan) {
        const currentLang = localStorage.getItem('lang') || 'en';
        
        const planName = i18nData[currentLang]?.[`plan_${plan.id}_name`] || plan.name;
        const planDescription = i18nData[currentLang]?.[`plan_${plan.id}_desc`] || plan.description;

        const inFavText = i18nData[currentLang]?.inFavorites || 'In Favorites';
        const addToCartText = i18nData[currentLang]?.addToCart || 'Add to Cart';

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
                    <button class="action-btn favorite-btn active" title="Remove from favorites">
                       ${inFavText}
                    </button>
                    <button class="action-btn cart-btn">
                        ${addToCartText}
                    </button>
                </div>
            </div>
        `;

        const favoriteBtn = card.querySelector('.favorite-btn');
        favoriteBtn.addEventListener('click', async () => {

            const response = await fetch(`${API_BASE_URL}/favorites?userId=${currentUser.id}&planId=${plan.id}`);
            const favoriteRecords = await response.json();
            if(favoriteRecords.length > 0) {
                const recordId = favoriteRecords[0].id;
                await fetch(`${API_BASE_URL}/favorites/${recordId}`, { method: 'DELETE' });
                card.remove();

                if (favoritesContainer.children.length === 0) {
                    displayEmptyMessage();
                }
            }
        });
        
        return card;
    }

    function displayEmptyMessage() {
        const currentLang = localStorage.getItem('lang') || 'en';
        const emptyMessage = i18nData[currentLang]?.favoritesEmpty || 'Your favorites list is empty.';
        favoritesContainer.innerHTML = `<p class="info-message">${emptyMessage}</p>`;
    }

    async function displayFavoritePlans() {
        if (!currentUser) {

            favoritesContainer.innerHTML = `<p class="info-message">Please log in to see your favorites.</p>`;
            return;
        }

        favoritesContainer.innerHTML = `<p>Loading...</p>`; 
        try {

            const response = await fetch(`${API_BASE_URL}/favorites?userId=${currentUser.id}&_expand=plan`);
            if (!response.ok) throw new Error('Network response was not ok');
            
            const favorites = await response.json();

            favoritesContainer.innerHTML = ''; 

            if (favorites.length === 0) {
                displayEmptyMessage();
            } else {
                favorites.forEach(fav => {

                    if (fav.plan) {
                        const card = renderPlanCard(fav.plan);
                        favoritesContainer.appendChild(card);
                    }
                });
            }
        } catch (error) {
            console.error('Failed to load favorites:', error);
            const currentLang = localStorage.getItem('lang') || 'en';

            const errorMessage = i18nData[currentLang]?.favoritesLoadError || 'Could not load your favorites. Please try again later.';
            favoritesContainer.innerHTML = `<p class="error-message">${errorMessage}</p>`;
        }
    }

    initializeFavorites();
});
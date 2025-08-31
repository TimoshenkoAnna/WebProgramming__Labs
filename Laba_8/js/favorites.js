document.addEventListener('DOMContentLoaded', function () {
    const API_BASE_URL = 'http://localhost:3000';
    const favoritesContainer = document.getElementById('favorites-container');

    async function renderFavorites() {
        favoritesContainer.innerHTML = '';

        try {
            const response = await fetch(`${API_BASE_URL}/favorites`);
            const favorites = await response.json();

            if (favorites.length === 0) {
                favoritesContainer.innerHTML = `
                    <div class="favorites-empty-message">
                        <h3>Your Favorites is Empty</h3>
                        <p>You haven't added any plans to your favorites yet. Go back to the catalog to find plans you like!</p>
                        <a href="catalog.html" class="control-btn">Back to Catalog</a>
                    </div>
                `;
                return;
            }

            favorites.forEach(plan => {
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
                            <span class="plan-card__coverage">Coverage: <strong>$${plan.coverage.toLocaleString()}</strong></span>
                            <span class="plan-card__rating">Rating: <strong>${plan.rating.toFixed(1)}</strong></span>
                            <span class="plan-card__fee">Price: <strong>$${plan.price}</strong>/mo</span>
                        </div>
                        <div class="plan-card__actions">
                            <button class="remove-from-favorites-btn" data-id="${plan.id}">Remove from Favorites</button>
                        </div>
                    </div>
                `;
                favoritesContainer.appendChild(card);
            });

            document.querySelectorAll('.remove-from-favorites-btn').forEach(button => {
                button.addEventListener('click', handleRemoveFromFavorites);
            });

        } catch (error) {
            console.error('Error fetching favorites:', error);
            favoritesContainer.innerHTML = '<div class="favorites-empty-message"><h3>Error loading data</h3><p>Could not load your favorites. Please try again later.</p></div>';
        }
    }

    async function handleRemoveFromFavorites(event) {
        const planId = event.target.dataset.id;

        if (!confirm('Are you sure you want to remove this plan from your favorites?')) {
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/favorites/${planId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('Plan removed from favorites!');
                renderFavorites();
            } else {
                alert('Failed to remove the plan. Please try again.');
            }
        } catch (error) {
            console.error('Error removing from favorites:', error);
            alert('An error occurred. Please try again.');
        }
    }

    renderFavorites();
});
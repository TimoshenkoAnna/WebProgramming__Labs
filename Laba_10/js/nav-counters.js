document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'http://localhost:3000';
    const cartCounter = document.getElementById('cart-counter');
    const favoritesCounter = document.getElementById('favorites-counter');

    async function updateNavCounters() {
        try {
            const [cartResponse, favoritesResponse] = await Promise.all([
                fetch(`${API_BASE_URL}/cart`),
                fetch(`${API_BASE_URL}/favorites`)
            ]);

            const cartItems = await cartResponse.json();
            const favoriteItems = await favoritesResponse.json();

            if (cartCounter) {
                cartCounter.textContent = cartItems.length;
                cartCounter.classList.add('pop');
                setTimeout(() => cartCounter.classList.remove('pop'), 400);
            }

            if (favoritesCounter) {
                favoritesCounter.textContent = favoriteItems.length;
                favoritesCounter.classList.add('pop');
                setTimeout(() => favoritesCounter.classList.remove('pop'), 400);
            }

        } catch (error) {
            console.error("Failed to update nav counters:", error);
        }
    }

    updateNavCounters();

    document.addEventListener('dataChanged', () => {
        updateNavCounters();
    });
});
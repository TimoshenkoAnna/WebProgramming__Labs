document.addEventListener('DOMContentLoaded', function () {
    const API_BASE_URL = 'http://localhost:3000';

    const cartContainer = document.getElementById('cart-container');
    const tableBody = document.getElementById('cart-table-body');
    const cartTotalSpan = document.getElementById('cart-total');
    const checkoutButton = document.getElementById('checkout-btn');
    const emptyCartMessage = document.getElementById('cart-empty-message');

    async function renderCart() {
        try {
            const response = await fetch(`${API_BASE_URL}/cart`);
            const cartItems = await response.json();

            tableBody.innerHTML = '';

            if (cartItems.length === 0) {
                cartContainer.style.display = 'none';
                emptyCartMessage.style.display = 'block';
                return;
            }

            cartContainer.style.display = 'block';
            emptyCartMessage.style.display = 'none';

            let totalCost = 0;

            cartItems.forEach(item => {
                const quantity = item.quantity || 1;
                const subtotal = item.price * quantity;
                totalCost += subtotal;

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td data-label="Product">
                        <div class="product-info">
                            <img src="${item.image}" alt="${item.name}">
                            <span>${item.name}</span>
                        </div>
                    </td>
                    <td data-label="Price">$${item.price.toFixed(2)}</td>
                    <td data-label="Quantity">
                        <input type="number" class="quantity-input" value="${quantity}" min="1" data-id="${item.id}">
                    </td>
                    <td data-label="Subtotal">$${subtotal.toFixed(2)}</td>
                    <td data-label="Actions">
                        <button class="remove-from-cart-btn" data-id="${item.id}">Remove</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });

            cartTotalSpan.textContent = `$${totalCost.toFixed(2)}`;

            attachEventListeners();

        } catch (error) {
            console.error('Error rendering cart:', error);
            emptyCartMessage.innerHTML = '<h3>Error loading cart</h3>';
            emptyCartMessage.style.display = 'block';
            cartContainer.style.display = 'none';
        }
    }

    function attachEventListeners() {
        document.querySelectorAll('.remove-from-cart-btn').forEach(button => {
            button.addEventListener('click', handleRemoveItem);
        });

        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', handleQuantityChange);
        });
    }

    async function handleRemoveItem(event) {
        const itemId = event.target.dataset.id;
        if (confirm('Are you sure you want to remove this item?')) {
            try {
                await fetch(`${API_BASE_URL}/cart/${itemId}`, { method: 'DELETE' });
                renderCart();
            } catch (error) {
                console.error('Failed to remove item:', error);
            }
        }
    }

    async function handleQuantityChange(event) {
        const itemId = event.target.dataset.id;
        const newQuantity = parseInt(event.target.value);

        if (newQuantity < 1) {
            handleRemoveItem({ target: { dataset: { id: itemId } } });
            return;
        }

        try {
            await fetch(`${API_BASE_URL}/cart/${itemId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quantity: newQuantity })
            });
            renderCart();
        } catch (error) {
            console.error('Failed to update quantity:', error);
        }
    }

    async function handleCheckout() {
        if (!confirm('Are you sure you want to complete your purchase? This will clear your cart.')) {
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/cart`);
            const cartItems = await response.json();

            const deletePromises = cartItems.map(item =>
                fetch(`${API_BASE_URL}/cart/${item.id}`, { method: 'DELETE' })
            );

            await Promise.all(deletePromises);

            alert('Thank you for your purchase! Your cart has been cleared.');
            renderCart();
        } catch (error) {
            console.error('Checkout failed:', error);
            alert('An error occurred during checkout. Please try again.');
        }
    }
    
    checkoutButton.addEventListener('click', handleCheckout);

    renderCart();
});
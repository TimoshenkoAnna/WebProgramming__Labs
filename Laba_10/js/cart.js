document.addEventListener('DOMContentLoaded', function () {
    const API_BASE_URL = 'http://localhost:3000';

    const cartContainer = document.getElementById('cart-container');
    const tableBody = document.getElementById('cart-table-body');
    const cartTotalSpan = document.getElementById('cart-total');
    const checkoutButton = document.getElementById('checkout-btn');
    const emptyCartMessage = document.getElementById('cart-empty-message');

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    async function renderCart() {
        if (!currentUser) {
            cartContainer.style.display = 'none';
            emptyCartMessage.style.display = 'block';
            emptyCartMessage.innerHTML = `<h3 data-i18n="cartLogInTitle">Please Log In</h3><p data-i18n="cartLogInSubtitle">Log in to view your shopping cart.</p>`;
             if (window.getTranslate) {
                window.getTranslate(localStorage.getItem('lang') || 'en');
            }
            return;
        }
        
        try {
            const response = await fetch(`${API_BASE_URL}/cart?userId=${currentUser.id}`);
            const cartItems = await response.json();

            if (!tableBody) return;
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
                        <button class="remove-from-cart-btn" data-id="${item.id}" data-i18n="remove">Remove</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });

            cartTotalSpan.textContent = `$${totalCost.toFixed(2)}`;
            attachEventListeners();

            if (window.getTranslate) {
                window.getTranslate(localStorage.getItem('lang') || 'en');
            }

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
        const confirmationMessage = window.i18Obj && window.i18Obj[localStorage.getItem('lang') || 'en']['confirmRemove']
            ? window.i18Obj[localStorage.getItem('lang') || 'en']['confirmRemove']
            : 'Are you sure you want to remove this item?';

        if (confirm(confirmationMessage)) {
            try {
                await fetch(`${API_BASE_URL}/cart/${itemId}`, { method: 'DELETE' });
                renderCart();
                document.dispatchEvent(new Event('dataChanged'));
            } catch (error) {
                console.error('Failed to remove item:', error);
            }
        }
    }

    async function handleQuantityChange(event) {
        const itemId = event.target.dataset.id;
        const newQuantity = parseInt(event.target.value);

        if (newQuantity < 1) {

            const removeButton = document.querySelector(`.remove-from-cart-btn[data-id="${itemId}"]`);
            handleRemoveItem({ target: removeButton });
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
        const confirmationMessage = window.i18Obj && window.i18Obj[localStorage.getItem('lang') || 'en']['confirmCheckout']
            ? window.i18Obj[localStorage.getItem('lang') || 'en']['confirmCheckout']
            : 'Are you sure you want to complete your purchase? This will create an order and clear your cart.';
        
        if (!confirm(confirmationMessage)) {
            return;
        }

        try {
            const cartResponse = await fetch(`${API_BASE_URL}/cart?userId=${currentUser.id}`);
            const cartItems = await cartResponse.json();

            if (cartItems.length === 0) {
                alert('Your cart is empty.');
                return;
            }

            const totalAmount = cartItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
            const newOrder = {
                userId: currentUser.id,
                orderDate: new Date().toISOString(),
                items: cartItems.map(item => ({
                    planId: item.planId,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity || 1
                })),
                totalAmount: totalAmount
            };

            const orderResponse = await fetch(`${API_BASE_URL}/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newOrder)
            });

            if (!orderResponse.ok) {
                throw new Error('Failed to create the order.');
            }

            const deletePromises = cartItems.map(item =>
                fetch(`${API_BASE_URL}/cart/${item.id}`, { method: 'DELETE' })
            );

            await Promise.all(deletePromises);

            alert('Thank you for your purchase! Your order has been placed.');
            renderCart();
            document.dispatchEvent(new Event('dataChanged'));
        } catch (error) {
            console.error('Checkout failed:', error);
            alert('An error occurred during checkout. Please try again.');
        }
    }
    
    if(checkoutButton) {
        checkoutButton.addEventListener('click', handleCheckout);
    }

    renderCart();
});
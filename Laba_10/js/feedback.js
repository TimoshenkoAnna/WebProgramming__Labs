document.addEventListener('DOMContentLoaded', () => {

    const CURRENT_USER_ID = 2;

    const API_BASE_URL = 'http://localhost:3000';
    const MIN_REVIEW_LENGTH = 5;

    const form = document.getElementById('feedback-form');
    const planSelect = document.getElementById('plan-select');
    const ratingStars = document.getElementById('star-rating');
    const reviewText = document.getElementById('review-text');
    const charCounter = document.getElementById('char-counter');
    const submitBtn = document.getElementById('submit-feedback-btn');
    const formMessage = document.getElementById('form-message');
    const feedbackContainer = document.getElementById('feedback-container');
    const adminMessage = document.getElementById('admin-message');

    let currentUser = null;

    async function initializePage() {
        try {
            const user = await fetchUser(CURRENT_USER_ID);
            currentUser = user;

            if (user.role === 'admin') {
                feedbackContainer.style.display = 'none';
                adminMessage.style.display = 'block';
                return;
            }

            await populatePurchasedPlans(CURRENT_USER_ID);
            
            setupEventListeners();
            updateCharCounter();
        } catch (error) {
            console.error('Initialization failed:', error);
            formMessage.textContent = 'Error loading page data. Please try again later.';
            formMessage.className = 'form-message error';
        }
    }

    async function fetchUser(userId) {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`);
        if (!response.ok) throw new Error('User not found');
        return await response.json();
    }

    async function populatePurchasedPlans(userId) {
        const ordersResponse = await fetch(`${API_BASE_URL}/orders?userId=${userId}`);
        const orders = await ordersResponse.json();

        if (orders.length === 0) {
            planSelect.innerHTML = '<option value="">You have not purchased any plans yet</option>';
            planSelect.disabled = true;
            return;
        }

        const purchasedPlanIds = new Set();
        orders.forEach(order => {
            order.items.forEach(item => {
                purchasedPlanIds.add(item.planId);
            });
        });

        const planPromises = Array.from(purchasedPlanIds).map(id =>
            fetch(`${API_BASE_URL}/plans/${id}`).then(res => res.json())
        );
        const purchasedPlans = await Promise.all(planPromises);

        planSelect.innerHTML = '<option value="">-- Select a plan --</option>';
        purchasedPlans.forEach(plan => {
            const option = document.createElement('option');
            option.value = plan.id;
            option.textContent = plan.name;
            planSelect.appendChild(option);
        });
    }

    function setupEventListeners() {
        form.addEventListener('input', validateForm);
        form.addEventListener('submit', handleFormSubmit);
    }

    function updateCharCounter() {
        const currentLength = reviewText.value.length;
        charCounter.textContent = `${currentLength} / ${MIN_REVIEW_LENGTH}`;
        charCounter.style.color = currentLength >= MIN_REVIEW_LENGTH ? '#43806C' : '#c94c4c';
    }

    function validateForm() {
        updateCharCounter();
        
        const isPlanSelected = planSelect.value !== '';
        const isRatingSelected = form.querySelector('input[name="rating"]:checked') !== null;
        const isReviewValid = reviewText.value.trim().length >= MIN_REVIEW_LENGTH;

        submitBtn.disabled = !(isPlanSelected && isRatingSelected && isReviewValid);
    }

    
    async function handleFormSubmit(event) {
        event.preventDefault();
        validateForm(); 
        if (submitBtn.disabled) return;

        const newFeedback = {
            planId: parseInt(planSelect.value),
            userId: CURRENT_USER_ID,
            nickname: currentUser.nickname,
            rating: parseInt(form.querySelector('input[name="rating"]:checked').value),
            comment: reviewText.value.trim(),
            date: new Date().toISOString(),
            status: "pending" 
        };

        try {
            const response = await fetch(`${API_BASE_URL}/feedback`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newFeedback)
            });

            if (!response.ok) throw new Error('Server error');

            formMessage.textContent = 'Thank you! Your feedback has been submitted successfully.';
            formMessage.className = 'form-message success';
            form.reset();
            submitBtn.disabled = true;
            updateCharCounter();

        } catch (error) {
            formMessage.textContent = 'Failed to submit feedback. Please try again.';
            formMessage.className = 'form-message error';
        }
    }

    initializePage();
});
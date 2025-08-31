document.addEventListener('DOMContentLoaded', () => {

    const CURRENT_USER_ID = 1;

    const API_BASE_URL = 'http://localhost:3000';

    const accessDeniedContainer = document.getElementById('admin-access-denied');
    const adminPanelContainer = document.getElementById('admin-panel-container');

    const planForm = document.getElementById('plan-form');
    const planIdInput = document.getElementById('plan-id');
    const savePlanBtn = document.getElementById('save-plan-btn');
    const clearFormBtn = document.getElementById('clear-form-btn');
    const plansTableBody = document.getElementById('plans-table-body');
    const planInputs = planForm.querySelectorAll('input[required], textarea[required]');

    const feedbackTableBody = document.getElementById('feedback-table-body');
    const filterByPlanSelect = document.getElementById('filter-by-plan');
    const filterByUserSelect = document.getElementById('filter-by-user');
    const resetFiltersBtn = document.getElementById('reset-filters-btn');

    let editMode = false;

    async function initializePage() {
        try {
            const response = await fetch(`${API_BASE_URL}/users/${CURRENT_USER_ID}`);
            if (!response.ok) throw new Error('User not found');
            const user = await response.json();

            if (user.role !== 'admin') {
                accessDeniedContainer.style.display = 'block';
                return;
            }

            adminPanelContainer.style.display = 'block';
            await loadPlans();
            await loadFeedback();
            await populateFilterDropdowns();
            setupEventListeners();
        } catch (error) {
            accessDeniedContainer.style.display = 'block';
        }
    }

    async function loadPlans() {
        try {
            const response = await fetch(`${API_BASE_URL}/plans`);
            const plans = await response.json();
            plansTableBody.innerHTML = '';
            plans.forEach(plan => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${plan.id}</td>
                    <td>${plan.name}</td>
                    <td>$${plan.price}</td>
                    <td>
                        <button class="action-btn edit-btn" data-id="${plan.id}">Edit</button>
                        <button class="action-btn delete-btn" data-id="${plan.id}">Delete</button>
                    </td>
                `;
                plansTableBody.appendChild(row);
            });
        } catch (error) { console.error('Failed to load plans:', error); }
    }

    async function loadFeedback() {
        let url = `${API_BASE_URL}/feedback?_expand=plan&_expand=user`;
        const planFilter = filterByPlanSelect.value;
        const userFilter = filterByUserSelect.value;

        if (planFilter) url += `&planId=${planFilter}`;
        if (userFilter) url += `&userId=${userFilter}`;

        try {
            const response = await fetch(url);
            const feedbacks = await response.json();
            feedbackTableBody.innerHTML = '';
            feedbacks.forEach(fb => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${fb.plan?.name || 'Plan Deleted'}</td>
                    <td>${fb.user?.nickname || 'User Deleted'}</td>
                    <td>${'&#9733;'.repeat(fb.rating)}<span style="color:#ccc;">${'&#9733;'.repeat(5-fb.rating)}</span></td>
                    <td class="comment-col">${fb.comment}</td>
                    <td>
                        <button class="action-btn delete-btn" data-id="${fb.id}">Delete</button>
                    </td>
                `;
                feedbackTableBody.appendChild(row);
            });
        } catch (error) { console.error('Failed to load feedback:', error); }
    }

    async function populateFilterDropdowns() {
        try {
            const [plansRes, usersRes] = await Promise.all([
                fetch(`${API_BASE_URL}/plans`),
                fetch(`${API_BASE_URL}/users`)
            ]);
            const plans = await plansRes.json();
            const users = await usersRes.json();

            plans.forEach(plan => { filterByPlanSelect.innerHTML += `<option value="${plan.id}">${plan.name}</option>`; });
            users.forEach(user => { filterByUserSelect.innerHTML += `<option value="${user.id}">${user.nickname}</option>`; });
        } catch (error) { console.error('Failed to populate filters:', error); }
    }

    function validatePlanForm() {
        let isValid = true;
        planInputs.forEach(input => {
            const errorDiv = input.nextElementSibling;
            if (input.value.trim() === '') {
                isValid = false;
                input.classList.add('invalid');
                if (errorDiv) errorDiv.textContent = 'This field is required.';
            } else {
                input.classList.remove('invalid');
                if (errorDiv) errorDiv.textContent = '';
            }
        });
        savePlanBtn.disabled = !isValid;
    }

    function resetPlanForm() {
        planForm.reset();
        planIdInput.value = '';
        editMode = false;
        savePlanBtn.textContent = 'Add Plan';
        planInputs.forEach(input => {
            input.classList.remove('invalid');
            const errorDiv = input.nextElementSibling;
            if (errorDiv) errorDiv.textContent = '';
        });
        validatePlanForm();
    }

    function setupEventListeners() {
        planForm.addEventListener('input', validatePlanForm);
        clearFormBtn.addEventListener('click', resetPlanForm);
        planForm.addEventListener('submit', handlePlanFormSubmit);
        plansTableBody.addEventListener('click', handlePlanActions);

        filterByPlanSelect.addEventListener('change', loadFeedback);
        filterByUserSelect.addEventListener('change', loadFeedback);
        resetFiltersBtn.addEventListener('click', () => {
            filterByPlanSelect.value = '';
            filterByUserSelect.value = '';
            loadFeedback();
        });
        feedbackTableBody.addEventListener('click', handleFeedbackDelete);
    }

    async function handlePlanFormSubmit(e) {
        e.preventDefault();
        validatePlanForm();
        if (savePlanBtn.disabled) return;

        const planData = {
            name: document.getElementById('plan-name').value,
            type: document.getElementById('plan-type').value,
            price: parseFloat(document.getElementById('plan-price').value),
            coverage: parseInt(document.getElementById('plan-coverage').value),
            tier: document.getElementById('plan-tier').value,
            rating: parseFloat(document.getElementById('plan-rating').value) || null,
            description: document.getElementById('plan-description').value,
            image: document.getElementById('plan-image').value,
        };

        const url = editMode ? `${API_BASE_URL}/plans/${planIdInput.value}` : `${API_BASE_URL}/plans`;
        const method = editMode ? 'PUT' : 'POST';

        await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(planData)
        });

        resetPlanForm();
        await loadPlans();
        await populateFilterDropdowns(); 
    }

    async function handlePlanActions(e) {
        const target = e.target;
        const id = target.dataset.id;
        if (!id) return;

        if (target.classList.contains('delete-btn')) {
            if (confirm(`Are you sure you want to delete plan #${id}?`)) {
                await fetch(`${API_BASE_URL}/plans/${id}`, { method: 'DELETE' });
                await loadPlans();
                await populateFilterDropdowns();
            }
        } else if (target.classList.contains('edit-btn')) {
            const response = await fetch(`${API_BASE_URL}/plans/${id}`);
            const plan = await response.json();

            document.getElementById('plan-id').value = plan.id;
            document.getElementById('plan-name').value = plan.name;
            document.getElementById('plan-type').value = plan.type;
            document.getElementById('plan-price').value = plan.price;
            document.getElementById('plan-coverage').value = plan.coverage;
            document.getElementById('plan-tier').value = plan.tier;
            document.getElementById('plan-rating').value = plan.rating;
            document.getElementById('plan-description').value = plan.description;
            document.getElementById('plan-image').value = plan.image;
            
            editMode = true;
            savePlanBtn.textContent = 'Update Plan';
            validatePlanForm();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    async function handleFeedbackDelete(e) {
        const target = e.target;
        const id = target.dataset.id;
        if (id && target.classList.contains('delete-btn')) {
            if (confirm(`Are you sure you want to delete feedback #${id}?`)) {
                await fetch(`${API_BASE_URL}/feedback/${id}`, { method: 'DELETE' });
                await loadFeedback();
            }
        }
    }

    initializePage();
});
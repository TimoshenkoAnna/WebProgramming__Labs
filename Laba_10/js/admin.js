document.addEventListener('DOMContentLoaded', () => {

    const CURRENT_USER_ID = 1;
    const API_BASE_URL = 'http://localhost:3000';

    const accessDeniedContainer = document.getElementById('admin-access-denied');
    const adminPanelContainer = document.getElementById('admin-panel-container');
    const plansTableBody = document.getElementById('plans-table-body');
    const feedbackTableBody = document.getElementById('feedback-table-body');
    const filterByPlanSelect = document.getElementById('filter-by-plan');
    const filterByUserSelect = document.getElementById('filter-by-user');
    const resetFiltersBtn = document.getElementById('reset-filters-btn');

    const planModal = document.getElementById('plan-modal');
    const addPlanModalBtn = document.getElementById('add-plan-modal-btn');
    const closePlanModalBtn = document.getElementById('close-plan-modal');
    const planModalTitle = document.getElementById('plan-modal-title');
    const planForm = document.getElementById('plan-form');
    const planIdInput = document.getElementById('plan-id');
    const savePlanBtn = document.getElementById('save-plan-btn');
    const clearFormBtn = document.getElementById('clear-form-btn');
    const planInputs = planForm ? planForm.querySelectorAll('input[required], textarea[required]') : [];

    const detailsModal = document.getElementById('plan-details-modal');
    const closeDetailsModalBtn = document.getElementById('close-details-modal');
    const detailsContent = document.getElementById('plan-details-content');

    const deleteModal = document.getElementById('delete-confirm-modal');
    const closeDeleteModalBtn = document.getElementById('close-delete-modal');
    const deleteMessage = document.getElementById('delete-confirm-message');
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    const cancelDeleteBtn = document.getElementById('cancel-delete-btn');

    let editMode = false;
    let currentDeleteId = null;

    const openModal = (modal) => {
        if (modal) modal.classList.add('active');
    };
    const closeModal = (modal) => {
        if (modal) modal.classList.remove('active');
    };

    if (addPlanModalBtn) {
        addPlanModalBtn.addEventListener('click', () => {
            resetPlanForm();
            planModalTitle.textContent = 'Add Plan';
            savePlanBtn.textContent = 'Save Plan';
            editMode = false;
            openModal(planModal);
        });
    }
    if (closePlanModalBtn) {
        closePlanModalBtn.addEventListener('click', () => closeModal(planModal));
    }
    if (planModal) {
        planModal.addEventListener('click', (e) => {
            if (e.target === planModal) closeModal(planModal);
        });
    }

    if (closeDetailsModalBtn) {
        closeDetailsModalBtn.addEventListener('click', () => closeModal(detailsModal));
    }
    if (detailsModal) {
        detailsModal.addEventListener('click', (e) => {
            if (e.target === detailsModal) closeModal(detailsModal);
        });
    }

    if (closeDeleteModalBtn) {
        closeDeleteModalBtn.addEventListener('click', () => closeModal(deleteModal));
    }
    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', () => closeModal(deleteModal));
    }
    if (deleteModal) {
        deleteModal.addEventListener('click', (e) => {
            if (e.target === deleteModal) closeModal(deleteModal);
        });
    }
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', async () => {
            if (currentDeleteId) {
                try {
                    await fetch(`${API_BASE_URL}/plans/${currentDeleteId}`, { method: 'DELETE' });
                    await loadPlans();
                    showToast(`Plan #${currentDeleteId} deleted successfully!`, 'success');
                } catch (error) {
                    showToast('Error deleting plan.', 'error');
                }
                currentDeleteId = null;
                closeModal(deleteModal);
            }
        });
    }

    async function initializePage() {
        try {
            const response = await fetch(`${API_BASE_URL}/users/${CURRENT_USER_ID}`);
            if (!response.ok) throw new Error('User not found');
            const user = await response.json();

            if (user.role !== 'admin') {
                if (accessDeniedContainer) accessDeniedContainer.style.display = 'block';
                return;
            }

            if (adminPanelContainer) adminPanelContainer.style.display = 'block';
            await loadPlans();
            await loadFeedback();
            await populateFilterDropdowns();
            setupEventListeners();
        } catch (error) {
            console.error("Initialization error:", error);
            if (accessDeniedContainer) accessDeniedContainer.style.display = 'block';
        }
    }

    async function loadPlans() {
        if (!plansTableBody) return;
        try {
            const response = await fetch(`${API_BASE_URL}/plans`);
            const plans = await response.json();
            plansTableBody.innerHTML = '';
            plans.forEach(plan => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${plan.id}</td>
                    <td class="plan-name" data-id="${plan.id}" style="cursor: pointer; color: blue;">${plan.name}</td>
                    <td>$${plan.price}</td>
                    <td>
                        <button class="action-btn edit-btn" data-id="${plan.id}">Edit</button>
                        <button class="action-btn delete-btn" data-id="${plan.id}">Delete</button>
                    </td>
                `;
                plansTableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Failed to load plans:', error);
        }
    }

    async function loadFeedback() {
        if (!feedbackTableBody || !filterByPlanSelect || !filterByUserSelect) return;
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
                    <td>${'&#9733;'.repeat(fb.rating)}<span style="color:#ccc;">${'&#9733;'.repeat(5 - fb.rating)}</span></td>
                    <td class="comment-col">${fb.comment}</td>
                    <td>
                        <button class="action-btn delete-btn" data-id="${fb.id}">Delete</button>
                    </td>
                `;
                feedbackTableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Failed to load feedback:', error);
        }
    }

    async function populateFilterDropdowns() {
        if (!filterByPlanSelect || !filterByUserSelect) return;
        try {
            const [plansRes, usersRes] = await Promise.all([
                fetch(`${API_BASE_URL}/plans`),
                fetch(`${API_BASE_URL}/users`)
            ]);
            const plans = await plansRes.json();
            const users = await usersRes.json();

            filterByPlanSelect.innerHTML = '<option value="">All Plans</option>';
            filterByUserSelect.innerHTML = '<option value="">All Users</option>';
            plans.forEach(plan => {
                filterByPlanSelect.innerHTML += `<option value="${plan.id}">${plan.name}</option>`;
            });
            users.forEach(user => {
                filterByUserSelect.innerHTML += `<option value="${user.id}">${user.nickname}</option>`;
            });
        } catch (error) {
            console.error('Failed to populate filters:', error);
        }
    }

    function validatePlanForm() {
        if (!planForm || !savePlanBtn) return;
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
        if (!planForm || !planIdInput || !planModalTitle || !savePlanBtn) return;
        planForm.reset();
        planIdInput.value = '';
        editMode = false;
        planModalTitle.textContent = 'Add Plan';
        savePlanBtn.textContent = 'Save Plan';
        planInputs.forEach(input => {
            input.classList.remove('invalid');
            const errorDiv = input.nextElementSibling;
            if (errorDiv) errorDiv.textContent = '';
        });
        validatePlanForm();
    }

    function setupEventListeners() {
        if (planForm) {
            planForm.addEventListener('input', validatePlanForm);
            planForm.addEventListener('submit', handlePlanFormSubmit);
        }
        if (clearFormBtn) clearFormBtn.addEventListener('click', resetPlanForm);
        if (plansTableBody) {
            plansTableBody.addEventListener('click', handlePlanActions);
        }
        if (filterByPlanSelect) filterByPlanSelect.addEventListener('change', loadFeedback);
        if (filterByUserSelect) filterByUserSelect.addEventListener('change', loadFeedback);
        if (resetFiltersBtn) {
            resetFiltersBtn.addEventListener('click', () => {
                filterByPlanSelect.value = '';
                filterByUserSelect.value = '';
                loadFeedback();
            });
        }
        if (feedbackTableBody) feedbackTableBody.addEventListener('click', handleFeedbackDelete);
    }

    async function handlePlanFormSubmit(e) {
        e.preventDefault();
        validatePlanForm();
        if (savePlanBtn && savePlanBtn.disabled) return;

        const planData = {
            name: document.getElementById('plan-name').value.trim(),
            type: document.getElementById('plan-type').value.trim(),
            price: parseFloat(document.getElementById('plan-price').value),
            coverage: parseInt(document.getElementById('plan-coverage').value),
            tier: document.getElementById('plan-tier').value,
            rating: parseFloat(document.getElementById('plan-rating').value) || null,
            description: document.getElementById('plan-description').value.trim(),
            image: document.getElementById('plan-image').value.trim(),
        };

        const url = editMode ? `${API_BASE_URL}/plans/${planIdInput.value}` : `${API_BASE_URL}/plans`;
        const method = editMode ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(planData)
            });
            if (!response.ok) throw new Error('Failed to save plan');
            closeModal(planModal);
            await loadPlans();
            showToast(editMode ? 'Plan updated successfully!' : 'Plan added successfully!', 'success');
        } catch (error) {
            console.error('Error saving plan:', error);
            showToast('An error occurred while saving the plan.', 'error');
        }
    }

    async function handlePlanActions(e) {
        const target = e.target;
        const id = target.dataset.id;

        if (target.classList.contains('plan-name')) {
            await showPlanDetails(id);
        } else if (target.classList.contains('edit-btn')) {
            await editPlan(id);
        } else if (target.classList.contains('delete-btn')) {
            currentDeleteId = id;
            deleteMessage.textContent = `Are you sure you want to delete plan #${id}? This action cannot be undone.`;
            openModal(deleteModal);
        }
    }

    async function showPlanDetails(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/plans/${id}`);
            const plan = await response.json();
            detailsContent.innerHTML = `
                <p><strong>ID:</strong> ${plan.id}</p>
                <p><strong>Name:</strong> ${plan.name}</p>
                <p><strong>Type:</strong> ${plan.type}</p>
                <p><strong>Price:</strong> $${plan.price}/mo</p>
                <p><strong>Coverage:</strong> $${plan.coverage}</p>
                <p><strong>Tier:</strong> ${plan.tier || 'None'}</p>
                <p><strong>Rating:</strong> ${plan.rating || 'N/A'}</p>
                <p><strong>Description:</strong> ${plan.description}</p>
                ${plan.image ? `<p><strong>Image:</strong> <img src="${plan.image}" alt="Plan Image" style="max-width: 200px;"></p>` : ''}
            `;
            openModal(detailsModal);
        } catch (error) {
            showToast('Error loading plan details.', 'error');
        }
    }

    async function editPlan(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/plans/${id}`);
            const plan = await response.json();

            planIdInput.value = plan.id;
            document.getElementById('plan-name').value = plan.name;
            document.getElementById('plan-type').value = plan.type;
            document.getElementById('plan-price').value = plan.price;
            document.getElementById('plan-coverage').value = plan.coverage;
            document.getElementById('plan-tier').value = plan.tier || '';
            document.getElementById('plan-rating').value = plan.rating || '';
            document.getElementById('plan-description').value = plan.description;
            document.getElementById('plan-image').value = plan.image || '';

            editMode = true;
            planModalTitle.textContent = 'Edit Plan';
            savePlanBtn.textContent = 'Update Plan';
            validatePlanForm();
            openModal(planModal);
        } catch (error) {
            showToast('Error loading plan for edit.', 'error');
        }
    }

    async function handleFeedbackDelete(e) {
        const target = e.target;
        if (!target.classList.contains('delete-btn') || !target.dataset.id) return;
        const id = target.dataset.id;

        if (confirm(`Are you sure you want to delete feedback #${id}?`)) {
            await fetch(`${API_BASE_URL}/feedback/${id}`, { method: 'DELETE' });
            await loadFeedback();
            showToast(`Feedback #${id} deleted.`, 'success');
        }
    }

    initializePage();
});
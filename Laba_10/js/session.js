document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'http://localhost:3000';

    const guestUI = document.getElementById('auth-guest');
    const userUI = document.getElementById('auth-user');
    const userProfileIcon = document.getElementById('user-profile-icon');
    const logoutBtn = document.getElementById('logout-btn');
    const adminLink = document.getElementById('admin-link');

    const profileModal = document.getElementById('user-profile-modal');
    const closeProfileModalBtn = document.getElementById('close-profile-modal');
    const profileForm = document.getElementById('profile-form');
    const resetSettingsBtn = document.getElementById('reset-settings-btn');

    const lastNameInput = document.getElementById('profile-lastName');
    const firstNameInput = document.getElementById('profile-firstName');
    const emailInput = document.getElementById('profile-email');
    const phoneInput = document.getElementById('profile-phone');
    const dobInput = document.getElementById('profile-dob');
    const nicknameInput = document.getElementById('profile-nickname');

    let currentUser = null;

    function updateSessionUI() {
        currentUser = JSON.parse(localStorage.getItem('currentUser'));

        if (currentUser) {

            if (guestUI) guestUI.style.display = 'none';
            if (userUI) userUI.style.display = 'flex';

            if (adminLink && currentUser.role === 'admin') {
                adminLink.style.display = 'block';
            } else if (adminLink) {
                adminLink.style.display = 'none';
            }
        } else {

            if (guestUI) guestUI.style.display = 'flex';
            if (userUI) userUI.style.display = 'none';
            if (adminLink) adminLink.style.display = 'none';
        }
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            const confirmLogout = confirm('Are you sure you want to log out?');
            if (confirmLogout) {
                localStorage.removeItem('currentUser');
                updateSessionUI();
                window.location.reload();
            }
        });
    }

    if (userProfileIcon) {
        userProfileIcon.addEventListener('click', () => {
            if (currentUser && profileModal) {
                if(lastNameInput) lastNameInput.value = currentUser.lastName || '';
                if(firstNameInput) firstNameInput.value = currentUser.firstName || '';
                if(emailInput) emailInput.value = currentUser.email || '';
                if(phoneInput) phoneInput.value = currentUser.phone || '';
                if(dobInput) dobInput.value = currentUser.dob || '';
                if(nicknameInput) nicknameInput.value = currentUser.nickname || '';
                profileModal.classList.add('active');
            }
        });
    }

    if (closeProfileModalBtn) {
        closeProfileModalBtn.addEventListener('click', () => profileModal.classList.remove('active'));
    }
    if (profileModal) {
        profileModal.addEventListener('click', (e) => {
            if (e.target === profileModal) {
                profileModal.classList.remove('active');
            }
        });
    }

    if (profileForm) {
        profileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!currentUser) return;

            const updatedUserData = {
                ...currentUser,
                lastName: lastNameInput.value.trim(),
                firstName: firstNameInput.value.trim(),
                email: emailInput.value.trim(),
                phone: phoneInput.value.trim(),
                dob: dobInput.value,
            };

            try {
                const response = await fetch(`${API_BASE_URL}/users/${currentUser.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedUserData)
                });
                if (!response.ok) throw new Error('Failed to update profile on server.');

                localStorage.setItem('currentUser', JSON.stringify(updatedUserData));
                currentUser = updatedUserData;
                
                if (window.showToast) showToast('Profile updated successfully!', 'success');
                else alert('Profile updated successfully!');
                
                profileModal.classList.remove('active');
            } catch (error) {
                console.error("Error updating profile:", error);
                if (window.showToast) showToast('Error updating profile.', 'error');
                else alert('Error updating profile.');
            }
        });
    }
    
    if (resetSettingsBtn) {
        resetSettingsBtn.addEventListener('click', () => {
             const confirmReset = confirm('Are you sure you want to reset your language and theme settings? Your profile data will not be affected.');
             if (confirmReset) {
                localStorage.removeItem('theme');
                localStorage.removeItem('lang');

                if (window.showToast) showToast('Settings have been reset. Reloading...', 'success');
                else alert('Settings have been reset. Reloading...');
                
                setTimeout(() => window.location.reload(), 1500);
             }
        });
    }

    updateSessionUI();
});
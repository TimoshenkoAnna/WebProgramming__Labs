document.addEventListener('DOMContentLoaded', () => {

    const LOGGED_IN_USER_ID = 1;

    const API_BASE_URL = 'http://localhost:3000';

    async function checkUserRole() {

        if (document.location.pathname.endsWith('admin.html')) {
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/users/${LOGGED_IN_USER_ID}`);
            if (!response.ok) return;

            const user = await response.json();
            
            const adminLink = document.getElementById('admin-link');
            if (adminLink && user.role === 'admin') {
                adminLink.style.display = 'block'; 
            }

        } catch (error) {
            console.error("Не удалось проверить роль пользователя:", error);
        }
    }

    checkUserRole();
});
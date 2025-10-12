document.addEventListener('DOMContentLoaded', () => {
    const themeSwitcher = document.getElementById('theme-switcher');
    const themeableImages = document.querySelectorAll('[data-theme-src-light]');
    
    const themeIcon = document.querySelector('.theme-icon'); 

    function applyTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');

            if (themeIcon) themeIcon.textContent = '☾'; 
        } else {
            document.body.classList.remove('dark-theme');

            if (themeIcon) themeIcon.textContent = '☀'; 
        }
        
        themeableImages.forEach(img => {
            const lightSrc = img.dataset.themeSrcLight;
            const darkSrc = img.dataset.themeSrcDark;
            img.src = theme === 'dark' ? darkSrc : lightSrc;
        });
    }

    if (themeSwitcher) {
        themeSwitcher.addEventListener('click', () => {
            const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            localStorage.setItem('theme', newTheme);
            applyTheme(newTheme);
        });
    }

    function init() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        applyTheme(savedTheme);
    }

    init();
});
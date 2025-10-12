document.addEventListener('DOMContentLoaded', () => {
    const burger = document.getElementById('burger-menu');
    const menu = document.getElementById('nav-links');
    const overlay = document.querySelector('.overlay');
    const menuLinks = menu.querySelectorAll('a');

    if (burger && menu && overlay) {

        const toggleMenu = () => {
            burger.classList.toggle('active');
            menu.classList.toggle('active');
            overlay.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        };

        burger.addEventListener('click', toggleMenu);

        overlay.addEventListener('click', () => {
            if (menu.classList.contains('active')) {
                toggleMenu();
            }
        });

        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (menu.classList.contains('active')) {
                    toggleMenu();
                }
            });
        });
    }
});
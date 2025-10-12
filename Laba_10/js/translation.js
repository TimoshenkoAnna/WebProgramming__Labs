document.addEventListener('DOMContentLoaded', async () => {
    const langSwitcher = document.querySelector('.lang-switcher');
    let i18nData = {};

    async function loadTranslations() {
        try {
            const response = await fetch('./translate.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            i18nData = await response.json();
        } catch (error) {
            console.error("Could not load translations:", error);
        }
    }

    function translatePage(lang) {
        if (!i18nData[lang]) {
            console.warn(`No translation data for language: ${lang}`);
            return;
        }

        const elementsToTranslate = document.querySelectorAll('[data-i18n]');
        
        elementsToTranslate.forEach(element => {
            const key = element.dataset.i18n;
            const translation = i18nData[lang][key];

            if (translation) {

                if (element.placeholder) {
                    element.placeholder = translation;
                } 

                else {
                    element.innerHTML = translation;
                }
            } else {
                console.warn(`No translation found for key: ${key} in language: ${lang}`);
            }
        });
    }

    function updateLangUI(lang) {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.lang === lang) {
                btn.classList.add('active');
            }
        });
        document.documentElement.setAttribute('lang', lang); 
    }

    if (langSwitcher) {
        langSwitcher.addEventListener('click', (event) => {
            const targetButton = event.target.closest('.lang-btn');
            if (targetButton && !targetButton.classList.contains('active')) {
                const newLang = targetButton.dataset.lang;
                localStorage.setItem('lang', newLang);
                translatePage(newLang);
                updateLangUI(newLang);
            }
        });
    }

    async function init() {
        await loadTranslations();
        const savedLang = localStorage.getItem('lang') || 'en'; 
        translatePage(savedLang);
        updateLangUI(savedLang);
    }

    window.getTranslate = translatePage;

    init();
});
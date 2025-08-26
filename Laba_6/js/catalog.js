document.addEventListener('DOMContentLoaded', function () {
    const catalog = [
        {
            name: 'Basic Shield',
            type: 'Individual',
            size: 'Small',
            colors: ['Bronze', 'Silver', 'Gold'],
            prices: { Bronze: 25, Silver: null, Gold: null },
            description: 'Covers essential risks like fractures and minor injuries. A great start for your safety.',
            image: 'https://placehold.co/600x400/43806C/FFFFFF?text=Basic+Shield',
            coverage: 5000,
            tier: 'bronze',
            rating: 4.2
        },
        {
            name: 'Family Standard',
            type: 'Family',
            size: 'Medium',
            colors: ['Bronze', 'Silver', 'Gold'],
            prices: { Bronze: null, Silver: 70, Gold: null },
            description: 'Comprehensive protection for the whole family. Includes child injuries and common illnesses.',
            image: 'https://placehold.co/600x400/214E41/FFFFFF?text=Family+Standard',
            coverage: 15000,
            tier: 'silver',
            rating: 4.5
        },
        {
            name: 'Corporate+',
            type: 'Corporate',
            size: 'Large',
            colors: ['Bronze', 'Silver', 'Gold'],
            prices: { Bronze: null, Silver: 55, Gold: null },
            description: 'A special offer for teams of 10 or more. Extended coverage and flexible terms.',
            image: 'https://placehold.co/600x400/E3EEED/214E41?text=Corporate+',
            coverage: 25000,
            tier: 'silver',
            rating: 4.0
        },
        {
            name: 'Injury Guard',
            type: 'Individual',
            size: 'Medium',
            colors: ['Bronze', 'Silver', 'Gold'],
            prices: { Bronze: null, Silver: 45, Gold: null },
            description: 'A specialized plan for athletes and individuals with an active lifestyle.',
            image: 'https://placehold.co/600x400/F0A446/214E41?text=Injury+Guard',
            coverage: 12000,
            tier: 'silver',
            rating: 4.8
        },
        {
            name: 'Total Coverage',
            type: 'Individual',
            size: 'Large',
            colors: ['Bronze', 'Silver', 'Gold'],
            prices: { Bronze: null, Silver: null, Gold: 120 },
            description: 'Maximum protection against a wide range of illnesses and accidents. Your peace of mind.',
            image: 'https://placehold.co/600x400/43806C/FFFFFF?text=Total+Coverage',
            coverage: 50000,
            tier: 'gold',
            rating: 4.7
        },
        {
            name: 'Kids Plan',
            type: 'Family',
            size: 'Small',
            colors: ['Bronze', 'Silver', 'Gold'],
            prices: { Bronze: 35, Silver: null, Gold: null },
            description: 'Take care of what matters most. Covers everything from scrapes to serious childhood illnesses.',
            image: 'https://placehold.co/600x400/214E41/FFFFFF?text=Kids+Plan',
            coverage: 10000,
            tier: 'bronze',
            rating: 4.3
        },
        {
            name: 'Business Premium',
            type: 'Corporate',
            size: 'Extra Large',
            colors: ['Bronze', 'Silver', 'Gold'],
            prices: { Bronze: null, Silver: null, Gold: 250 },
            description: 'The best solution for top management and key employees. Includes concierge service.',
            image: 'https://placehold.co/600x400/E3EEED/214E41?text=Business+Premium',
            coverage: 100000,
            tier: 'gold',
            rating: 4.9
        },
        {
            name: 'Easy Start',
            type: 'Individual',
            size: 'Small',
            colors: ['Bronze', 'Silver', 'Gold'],
            prices: { Bronze: 15, Silver: null, Gold: null },
            description: 'An affordable plan for students and young adults. Covers the most frequent doctor visits.',
            image: 'https://placehold.co/600x400/F0A446/214E41?text=Easy+Start',
            coverage: 3000,
            tier: 'bronze',
            rating: 3.9
        },
        {
            name: 'Parent Care',
            type: 'Family',
            size: 'Medium',
            colors: ['Bronze', 'Silver', 'Gold'],
            prices: { Bronze: null, Silver: 95, Gold: null },
            description: 'A specialized plan for the elderly, covering chronic conditions.',
            image: 'https://placehold.co/600x400/43806C/FFFFFF?text=Parent+Care',
            coverage: 20000,
            tier: 'silver',
            rating: 4.1
        },
        {
            name: 'IT Professional',
            type: 'Corporate',
            size: 'Medium',
            colors: ['Bronze', 'Silver', 'Gold'],
            prices: { Bronze: null, Silver: 60, Gold: null },
            description: 'A plan for IT professionals covering risks associated with a sedentary lifestyle.',
            image: 'https://placehold.co/600x400/214E41/FFFFFF?text=IT+Professional',
            coverage: 18000,
            tier: 'silver',
            rating: 4.4
        },
        {
            name: 'Critical Illness',
            type: 'Individual',
            size: 'Large',
            colors: ['Bronze', 'Silver', 'Gold'],
            prices: { Bronze: null, Silver: null, Gold: 150 },
            description: 'Focuses on covering expenses upon diagnosis of serious conditions like cancer or heart attack.',
            image: 'https://placehold.co/600x400/E3EEED/214E41?text=Critical+Illness',
            coverage: 75000,
            tier: 'gold',
            rating: 4.6
        },
        {
            name: 'Family Maximum',
            type: 'Family',
            size: 'Large',
            colors: ['Bronze', 'Silver', 'Gold'],
            prices: { Bronze: null, Silver: null, Gold: 130 },
            description: 'All the benefits of the "Family Standard" plan with double the coverage and additional options.',
            image: 'https://placehold.co/600x400/F0A446/214E41?text=Family+Maximum',
            coverage: 30000,
            tier: 'gold',
            rating: 4.7
        },
        {
            name: 'Startup Package',
            type: 'Corporate',
            size: 'Small',
            colors: ['Bronze', 'Silver', 'Gold'],
            prices: { Bronze: 40, Silver: null, Gold: null },
            description: 'A flexible and scalable plan for growing companies and startups. From 3 employees.',
            image: 'https://placehold.co/600x400/43806C/FFFFFF?text=Startup+Package',
            coverage: 10000,
            tier: 'bronze',
            rating: 4.0
        },
        {
            name: 'Traveler',
            type: 'Individual',
            size: 'Small',
            colors: ['Bronze', 'Silver', 'Gold'],
            prices: { Bronze: 30, Silver: null, Gold: null },
            description: 'Covers emergency medical care and injuries during domestic travel. Not a substitute for international travel insurance.',
            image: 'https://placehold.co/600x400/214E41/FFFFFF?text=Traveler',
            coverage: 8000,
            tier: 'bronze',
            rating: 4.2
        },
        {
            name: 'Women\'s Health',
            type: 'Individual',
            size: 'Medium',
            colors: ['Bronze', 'Silver', 'Gold'],
            prices: { Bronze: null, Silver: 85, Gold: null },
            description: 'A specialized plan covering risks related to women\'s health and pregnancy.',
            image: 'https://placehold.co/600x400/E3EEED/214E41?text=Women\'s+Health',
            coverage: 22000,
            tier: 'silver',
            rating: 4.5
        }
    ];

    const colorMap = {
        Bronze: '#CD7F32',
        Silver: '#A9A9A9',
        Gold: '#D4AF37'
    };

    const quantityMap = {
        'Basic Shield': 1,
        'Family Standard': 1,
        'Corporate+': 10,
        'Injury Guard': 1,
        'Total Coverage': 1,
        'Kids Plan': 1,
        'Business Premium': 1,
        'Easy Start': 1,
        'Parent Care': 1,
        'IT Professional': 1,
        'Critical Illness': 1,
        'Family Maximum': 1,
        'Startup Package': 3,
        'Traveler': 1,
        'Women\'s Health': 1
    };

    function renderCatalog(items) {
        const container = document.getElementById('catalog-container');
        if (!container) {
            console.error('Catalog container not found');
            return;
        }
        container.innerHTML = '';
        if (!items || items.length === 0) {
            container.innerHTML = `<div class="not-found-message">Sorry, no plans match your criteria. Please try different filters.</div>`;
            return;
        }

        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'plan-card';
            card.innerHTML = `
                <img src="${item.image || 'https://placehold.co/600x400/43806C/FFFFFF?text=Info'}" alt="${item.name || 'Information'}" class="plan-card__image">
                ${item.tier ? `<span class="plan-card__tier plan-card__tier--${item.tier}">${item.tier.charAt(0).toUpperCase() + item.tier.slice(1)}</span>` : ''}
                <div class="plan-card__content">
                    <span class="plan-card__category">${item.type || 'Info'}</span>
                    <h3 class="plan-card__title">${item.name || 'Information'}</h3>
                    <p class="plan-card__description">
                        Size: ${item.size || 'N/A'}<br>
                        Quantity: ${quantityMap[item.name] ? `${quantityMap[item.name]} unit(s)` : 'Per unit'}<br>
                        ${item.description || 'No description available.'}
                    </p>
                    <div class="plan-card__footer">
                        ${item.coverage ? `<span class="plan-card__coverage">Coverage: <strong>$${item.coverage.toLocaleString()}</strong></span>` : ''}
                        ${item.rating ? `<span class="plan-card__rating">Rating: <strong>${item.rating.toFixed(1)}</strong></span>` : ''}
                        ${Object.entries(item.prices)
                            .map(([color, price]) => 
                                price ? `<span class="plan-card__fee">${color}: <strong>$${price}</strong>/mo</span>` : ''
                            ).join('')}
                        ${item.annualFee ? `<span class="plan-card__annual">Annual: <strong>$${item.annualFee}</strong></span>` : ''}
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    }

    function getFilteredPlans() {
        let result = [...catalog];
        const search = document.getElementById('search-input').value.toLowerCase();
        const category = document.getElementById('category-select').value;

        if (search) {
            result = result.filter(item => 
                item.name.toLowerCase().includes(search) || 
                item.description.toLowerCase().includes(search)
            );
        }

        if (category !== 'all') {
            result = result.filter(item => item.type === category);
        }

        return result;
    }

    function applySorting(plans) {
        const sortBy = document.getElementById('sort-select').value;
        let sortedPlans = [...plans];

        switch (sortBy) {
            case 'name-az':
                sortedPlans.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-za':
                sortedPlans.sort((a, b) => b.name.localeCompare(b.name));
                break;
            case 'price-asc':
                sortedPlans.sort((a, b) => {
                    const priceA = Math.min(...Object.values(a.prices).filter(p => p !== null));
                    const priceB = Math.min(...Object.values(b.prices).filter(p => p !== null));
                    return priceA - priceB;
                });
                break;
            case 'price-desc':
                sortedPlans.sort((a, b) => {
                    const priceA = Math.max(...Object.values(a.prices).filter(p => p !== null));
                    const priceB = Math.max(...Object.values(b.prices).filter(p => p !== null));
                    return priceB - priceA;
                });
                break;
            case 'rating-asc':
                sortedPlans.sort((a, b) => (a.rating || 0) - (b.rating || 0));
                break;
            case 'rating-desc':
                sortedPlans.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            default:
                break;
        }

        return sortedPlans;
    }

    function applyMethod(method) {
        let result = getFilteredPlans();
        switch (method) {
            case 'map-annual-fee':
                result = result.map(item => ({
                    ...item,
                    annualFee: Object.values(item.prices).find(p => p !== null) * 12 || 0
                }));
                result = applySorting(result);
                break;
            case 'filter-high-coverage':
                result = result.filter(item => item.coverage > 20000);
                result = applySorting(result);
                break;
            case 'reduce-avg-fee':
                const total = result.reduce((sum, item) => {
                    const validPrices = Object.values(item.prices).filter(p => p !== null);
                    const minPrice = validPrices.length ? Math.min(...validPrices) : 0;
                    return sum + minPrice;
                }, 0);
                const avgFee = result.length ? (total / result.length).toFixed(2) : 0;
                result = [{
                    name: 'Average Monthly Fee',
                    type: 'Summary',
                    size: 'N/A',
                    colors: ['Bronze'],
                    prices: { Bronze: avgFee },
                    description: `The average monthly fee across ${result.length} filtered plans is $${avgFee}.`,
                    image: 'https://placehold.co/600x400/43806C/FFFFFF?text=Average+Fee',
                    coverage: 0,
                    tier: 'bronze',
                    rating: 0
                }];
                break;
            case 'sort-coverage-desc':
                result = result.sort((a, b) => b.coverage - a.coverage);
                break;
            case 'slice-top-expensive':
                result = result.sort((a, b) => {
                    const priceA = Math.max(...Object.values(a.prices).filter(p => p !== null));
                    const priceB = Math.max(...Object.values(b.prices).filter(p => p !== null));
                    return priceB - priceA;
                }).slice(0, 3);
                break;
            case 'includes-basic':
                const hasBasic = result.map(item => item.name).includes('Basic Shield');
                result = [{
                    name: 'Basic Shield Check',
                    type: 'Summary',
                    size: 'N/A',
                    colors: ['Bronze'],
                    prices: { Bronze: null },
                    description: hasBasic ? 'The "Basic Shield" plan is included in the filtered results.' : 'The "Basic Shield" plan is not included in the filtered results.',
                    image: 'https://placehold.co/600x400/43806C/FFFFFF?text=Basic+Shield+Check',
                    coverage: 0,
                    tier: 'bronze',
                    rating: 0
                }];
                break;
            case 'find-cheapest':
                result = [result.find(item => {
                    const validPrices = Object.values(item.prices).filter(p => p !== null);
                    return validPrices.length && Math.min(...validPrices) === Math.min(...result.flatMap(i => 
                        Object.values(i.prices).filter(p => p !== null)
                    ));
                })].filter(Boolean);
                result = applySorting(result);
                break;
            case 'every-premium':
                const allExpensive = result.every(item => 
                    Object.values(item.prices).some(p => p !== null && p > 100)
                );
                result = [{
                    name: 'Premium Plans Check',
                    type: 'Summary',
                    size: 'N/A',
                    colors: ['Bronze'],
                    prices: { Bronze: null },
                    description: allExpensive ? 'All filtered plans cost over $100/month.' : 'Not all filtered plans cost over $100/month.',
                    image: 'https://placehold.co/600x400/43806C/FFFFFF?text=Premium+Check',
                    coverage: 0,
                    tier: 'bronze',
                    rating: 0
                }];
                break;
            case 'flatmap-risks':
                result = result.flatMap(item => 
                    item.description.toLowerCase().split(/[\s,.]+/)
                        .filter(word => ['fractures', 'injuries', 'illnesses', 'cancer', 'heart', 'chronic', 'pregnancy'].includes(word))
                        .map(risk => ({
                            name: `Covered Risk: ${risk.charAt(0).toUpperCase() + risk.slice(1)}`,
                            type: 'Risk',
                            size: 'N/A',
                            colors: ['Bronze'],
                            prices: { Bronze: null },
                            description: `This risk is covered by the "${item.name}" plan.`,
                            image: 'https://placehold.co/600x400/43806C/FFFFFF?text=' + risk.charAt(0).toUpperCase() + risk.slice(1),
                            coverage: 0,
                            tier: 'bronze',
                            rating: 0
                        }))
                );
                result = [...new Map(result.map(item => [item.name, item])).values()];
                break;
            case 'findindex-family':
                const index = result.findIndex(item => item.type === 'Family');
                result = index !== -1 ? [result[index]] : [];
                result = applySorting(result);
                break;
        }
        renderCatalog(result);
    }

    function handleSearchAndFilter() {
        let result = getFilteredPlans();
        result = applySorting(result);
        renderCatalog(result);
    }

    const catalogContainer = document.getElementById('catalog-container');
    const searchInput = document.getElementById('search-input');
    const categorySelect = document.getElementById('category-select');
    const sortSelect = document.getElementById('sort-select');
    const resetButton = document.getElementById('btn-reset');
    const controlButtons = document.querySelectorAll('#catalog-controls .control-btn');

    if (!catalogContainer || !searchInput || !categorySelect || !sortSelect || !resetButton || !controlButtons.length) {
        console.error('One or more required DOM elements are missing');
        return;
    }

    searchInput.addEventListener('input', handleSearchAndFilter);
    categorySelect.addEventListener('change', handleSearchAndFilter);
    sortSelect.addEventListener('change', handleSearchAndFilter);

    resetButton.addEventListener('click', () => {
        searchInput.value = '';
        categorySelect.value = 'all';
        sortSelect.value = 'default';
        controlButtons.forEach(btn => btn.classList.remove('active'));
        renderCatalog(catalog);
    });

    document.getElementById('btn-filter-high-coverage').addEventListener('click', () => {
        controlButtons.forEach(btn => btn.classList.remove('active'));
        document.getElementById('btn-filter-high-coverage').classList.add('active');
        applyMethod('filter-high-coverage');
    });

    document.getElementById('btn-sort-coverage-desc').addEventListener('click', () => {
        controlButtons.forEach(btn => btn.classList.remove('active'));
        document.getElementById('btn-sort-coverage-desc').classList.add('active');
        applyMethod('sort-coverage-desc');
    });

    document.getElementById('btn-map-annual-fee').addEventListener('click', () => {
        controlButtons.forEach(btn => btn.classList.remove('active'));
        document.getElementById('btn-map-annual-fee').classList.add('active');
        applyMethod('map-annual-fee');
    });

    document.getElementById('btn-reduce-avg-fee').addEventListener('click', () => {
        controlButtons.forEach(btn => btn.classList.remove('active'));
        document.getElementById('btn-reduce-avg-fee').classList.add('active');
        applyMethod('reduce-avg-fee');
    });

    document.getElementById('btn-find-cheapest').addEventListener('click', () => {
        controlButtons.forEach(btn => btn.classList.remove('active'));
        document.getElementById('btn-find-cheapest').classList.add('active');
        applyMethod('find-cheapest');
    });

    document.getElementById('btn-every-premium').addEventListener('click', () => {
        controlButtons.forEach(btn => btn.classList.remove('active'));
        document.getElementById('btn-every-premium').classList.add('active');
        applyMethod('every-premium');
    });

    document.getElementById('btn-includes-basic').addEventListener('click', () => {
        controlButtons.forEach(btn => btn.classList.remove('active'));
        document.getElementById('btn-includes-basic').classList.add('active');
        applyMethod('includes-basic');
    });

    document.getElementById('btn-slice-top-expensive').addEventListener('click', () => {
        controlButtons.forEach(btn => btn.classList.remove('active'));
        document.getElementById('btn-slice-top-expensive').classList.add('active');
        applyMethod('slice-top-expensive');
    });

    document.getElementById('btn-flatmap-risks').addEventListener('click', () => {
        controlButtons.forEach(btn => btn.classList.remove('active'));
        document.getElementById('btn-flatmap-risks').classList.add('active');
        applyMethod('flatmap-risks');
    });

    document.getElementById('btn-findindex-family').addEventListener('click', () => {
        controlButtons.forEach(btn => btn.classList.remove('active'));
        document.getElementById('btn-findindex-family').classList.add('active');
        applyMethod('findindex-family');
    });
    renderCatalog(catalog);
});
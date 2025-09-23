document.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('custom-slider');
    if (!slider) {
        console.error('Slider element not found');
        return;
    }

    const track = document.getElementById('slider-track');
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');

    if (!track || !nextBtn || !prevBtn) {
        console.error('Required slider elements missing:', { track, nextBtn, prevBtn });
        return;
    }

    const slides = Array.from(track.children);
    const totalSlides = slides.length;
    let slidesVisible = 4;
    let slideWidth = 0;
    let currentIndex = 0;
    let autoPlayInterval;
    let isTransitioning = false;

    const updateSlideWidth = () => {
        const trackContainerWidth = track.parentElement.clientWidth;
        if (window.innerWidth <= 480) {
            slidesVisible = 2;
            slideWidth = trackContainerWidth / slidesVisible;
        } else if (window.innerWidth <= 768) {
            slidesVisible = 3;
            slideWidth = trackContainerWidth / slidesVisible;
        } else {
            slidesVisible = 4;
            slideWidth = trackContainerWidth / slidesVisible;
        }

        console.log('Updating slide width:', { trackContainerWidth, slidesVisible, slideWidth });

        slides.forEach(slide => {
            slide.style.width = `${slideWidth}px`;
            slide.style.minWidth = `${slideWidth}px`;
        });

        if (window.innerWidth > 480) {
            setupInfiniteScroll();
            moveToSlide(currentIndex, false);
        } else {
            track.style.transition = 'none';
            track.style.transform = 'translateX(0)';
            track.querySelectorAll('.clone').forEach(clone => clone.remove());
        }
    };

    const setupInfiniteScroll = () => {
        track.querySelectorAll('.clone').forEach(clone => clone.remove());

        for (let i = 0; i < slidesVisible; i++) {
            const clone = slides[totalSlides - 1 - i].cloneNode(true);
            clone.classList.add('clone');
            track.insertBefore(clone, track.firstChild);
        }

        for (let i = 0; i < slidesVisible; i++) {
            const clone = slides[i].cloneNode(true);
            clone.classList.add('clone');
            track.appendChild(clone);
        }

        track.style.transform = `translateX(-${slideWidth * slidesVisible}px)`;
    };

    const moveToSlide = (index, withAnimation = true) => {
        if (isTransitioning || window.innerWidth <= 480) return;
        isTransitioning = true;

        if (withAnimation) {
            track.style.transition = 'transform 0.5s ease';
        } else {
            track.style.transition = 'none';
        }

        const newPosition = - (index + slidesVisible) * slideWidth;
        track.style.transform = `translateX(${newPosition}px)`;
        currentIndex = index;

        console.log('Moving to slide:', { index, newPosition });
    };

    const slideNext = () => {
        if (window.innerWidth <= 480) {
            track.scrollBy({ left: slideWidth, behavior: 'smooth' });
        } else {
            moveToSlide(currentIndex + 1);
        }
        console.log('Slide next');
    };

    const slidePrev = () => {
        if (window.innerWidth <= 480) {
            track.scrollBy({ left: -slideWidth, behavior: 'smooth' });
        } else {
            moveToSlide(currentIndex - 1);
        }
        console.log('Slide prev');
    };

    track.addEventListener('transitionend', () => {
        isTransitioning = false;
        if (currentIndex >= totalSlides) {
            moveToSlide(0, false);
        } else if (currentIndex < 0) {
            moveToSlide(totalSlides - 1, false);
        }
    });

    const startAutoPlay = () => {
        if (autoPlayInterval) clearInterval(autoPlayInterval);
        if (window.innerWidth > 480) {
            autoPlayInterval = setInterval(slideNext, 3000);
        }
    };

    const stopAutoPlay = () => {
        clearInterval(autoPlayInterval);
    };

    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        if (window.innerWidth <= 480) {
            if (touchEndX < touchStartX - 50) slideNext();
            if (touchEndX > touchStartX + 50) slidePrev();
        }
    });

    nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Next button clicked');
        slideNext();
    });

    prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Prev button clicked');
        slidePrev();
    });

    slider.addEventListener('mouseenter', stopAutoPlay);
    slider.addEventListener('mouseleave', startAutoPlay);

    window.addEventListener('resize', () => {
        updateSlideWidth();
        startAutoPlay();
    });

    updateSlideWidth();
    startAutoPlay();
});
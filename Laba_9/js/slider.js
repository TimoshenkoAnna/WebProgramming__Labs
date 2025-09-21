document.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('custom-slider');

    if (slider) {
        const track = document.getElementById('slider-track');
        const slides = Array.from(track.children);
        const nextBtn = document.getElementById('next-btn');
        const prevBtn = document.getElementById('prev-btn');

        const slidesVisible = 4;
        const totalSlides = slides.length;

        let slideWidth = 0;
        let currentIndex = 0;
        let autoPlayInterval;
        let isTransitioning = false;

        const updateSlideWidth = () => {
            const trackContainerWidth = track.parentElement.clientWidth;
            slideWidth = trackContainerWidth / slidesVisible;
            
            slides.forEach(slide => {
                slide.style.width = `${slideWidth}px`;
            });
            
            setupInfiniteScroll();
            moveToSlide(currentIndex, false);
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
        }

        const moveToSlide = (index, withAnimation = true) => {
            if (isTransitioning) return;
            isTransitioning = true;

            if (withAnimation) {
                track.style.transition = 'transform 0.5s ease';
            } else {
                track.style.transition = 'none';
            }

            const newPosition = - (index + slidesVisible) * slideWidth;
            track.style.transform = `translateX(${newPosition}px)`;
            
            currentIndex = index;
        };

        const slideNext = () => {
            moveToSlide(currentIndex + 1);
        };

        const slidePrev = () => {
            moveToSlide(currentIndex - 1);
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
            autoPlayInterval = setInterval(slideNext, 3000);
        };

        const stopAutoPlay = () => {
            clearInterval(autoPlayInterval);
        };
        
        nextBtn.addEventListener('click', slideNext);
        prevBtn.addEventListener('click', slidePrev);
        
        slider.addEventListener('mouseenter', stopAutoPlay);
        slider.addEventListener('mouseleave', startAutoPlay);

        window.addEventListener('resize', updateSlideWidth);

        updateSlideWidth();
        startAutoPlay();
    }
});
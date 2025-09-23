document.addEventListener('DOMContentLoaded', () => {
  const parallaxSection = document.querySelector('.content__rating');
  const parallaxLayers = document.querySelectorAll('.parallax-layer');
  const parallaxContents = document.querySelectorAll('.parallax-content');
  const midLayer = document.querySelector('.parallax-layer-mid');

  if (!parallaxSection || parallaxLayers.length === 0 || !midLayer) {
    return;
  }

  const numDots = 60;
  for (let i = 0; i < numDots; i++) {
    const dot = document.createElement('div');
    dot.className = 'dot';
    dot.style.top = `${Math.random() * 100}%`;
    dot.style.left = `${Math.random() * 100}%`;
    midLayer.appendChild(dot);
  }

  function updateParallax() {
    const rect = parallaxSection.getBoundingClientRect();
    const sectionTop = rect.top;
    const sectionHeight = rect.height;
    const viewportHeight = window.innerHeight;
    const viewportCenter = viewportHeight / 2;

    if (sectionTop < viewportHeight && sectionTop + sectionHeight > 0) {
      const scrollProgress = Math.max(-1, Math.min(1, (viewportCenter - (sectionTop + sectionHeight / 2)) / (viewportHeight / 2)));

      parallaxLayers.forEach(layer => {
        const speed = parseFloat(layer.getAttribute('data-speed')) || 1;
        const maxMove = parseFloat(layer.getAttribute('data-max-move')) || 100;
        const translateY = scrollProgress * maxMove * speed;
        layer.style.transform = `translateY(${translateY}px)`;
      });

      parallaxContents.forEach((content, index) => {
        const speed = parseFloat(content.getAttribute('data-speed')) || 0.2;
        const maxMove = parseFloat(content.getAttribute('data-max-move')) || 30;
        const translateY = scrollProgress * maxMove * speed;
        content.style.transform = `translateY(${translateY}px)`;
      });
    }

    requestAnimationFrame(updateParallax);
  }

  if (window.innerWidth > 300) {
    window.addEventListener('scroll', () => {
      requestAnimationFrame(updateParallax);
    });
    updateParallax();
  }
});
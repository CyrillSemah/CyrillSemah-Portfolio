// Effets interactifs pour les projets

document.addEventListener('DOMContentLoaded', function() {
  // Effet 1: Réglette avant/après pour la photographie
  initBeforeAfterSliders();
  
  // Effet 2: Carrousel horizontal pour les maquettes
  initCarousels();
  
  // Effet 3: Style livre/magazine pour les maquettes
  initBookStyle();
  
  // Effet 4: Parallax au scroll pour les maquettes
  initParallaxScroll();
});

// Fonction pour initialiser les réglettes avant/après
function initBeforeAfterSliders() {
  const sliders = document.querySelectorAll('.before-after-container');
  
  sliders.forEach(slider => {
    const sliderHandle = slider.querySelector('.slider-handle');
    const beforeImage = slider.querySelector('.before-image');
    const afterImage = slider.querySelector('.after-image');
    
    if (!sliderHandle || !beforeImage || !afterImage) return;
    
    // Position initiale (50%)
    let sliderPosition = 50;
    updateSliderPosition(sliderPosition, beforeImage, afterImage, sliderHandle);
    
    // Gestion du déplacement de la réglette
    sliderHandle.addEventListener('mousedown', startDrag);
    slider.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);
    
    // Support tactile
    sliderHandle.addEventListener('touchstart', startDrag);
    slider.addEventListener('touchmove', drag);
    document.addEventListener('touchend', stopDrag);
    
    // Clic direct sur le slider
    slider.addEventListener('click', function(e) {
      if (e.target !== sliderHandle && !sliderHandle.contains(e.target)) {
        const rect = slider.getBoundingClientRect();
        const x = e.clientX - rect.left;
        sliderPosition = (x / rect.width) * 100;
        updateSliderPosition(sliderPosition, beforeImage, afterImage, sliderHandle);
      }
    });
    
    let isDragging = false;
    
    function startDrag(e) {
      e.preventDefault();
      isDragging = true;
    }
    
    function drag(e) {
      if (!isDragging) return;
      
      e.preventDefault();
      
      const rect = slider.getBoundingClientRect();
      let clientX;
      
      if (e.type === 'touchmove') {
        clientX = e.touches[0].clientX;
      } else {
        clientX = e.clientX;
      }
      
      const x = clientX - rect.left;
      sliderPosition = (x / rect.width) * 100;
      
      // Limiter entre 0 et 100
      sliderPosition = Math.max(0, Math.min(sliderPosition, 100));
      
      updateSliderPosition(sliderPosition, beforeImage, afterImage, sliderHandle);
    }
    
    function stopDrag() {
      isDragging = false;
    }
  });
}

function updateSliderPosition(position, beforeImage, afterImage, sliderHandle) {
  // Mettre à jour la position de la réglette
  sliderHandle.style.left = `${position}%`;
  
  // Mettre à jour l'affichage des images
  beforeImage.style.width = `${position}%`;
  afterImage.style.width = `${100 - position}%`;
}

// Fonction pour initialiser les carrousels
function initCarousels() {
  const carousels = document.querySelectorAll('.carousel-container');
  
  carousels.forEach(carousel => {
    const slides = carousel.querySelectorAll('.carousel-slide');
    const prevBtn = carousel.querySelector('.carousel-control.prev');
    const nextBtn = carousel.querySelector('.carousel-control.next');
    const dots = carousel.querySelectorAll('.pagination-dot');
    
    if (!slides.length) return;
    
    let currentSlide = 0;
    
    // Afficher la première slide
    showSlide(currentSlide);
    
    // Événements pour les boutons
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
      });
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
      });
    }
    
    // Événements pour les points de pagination
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        currentSlide = index;
        showSlide(currentSlide);
      });
    });
    
    function showSlide(index) {
      // Masquer toutes les slides
      slides.forEach(slide => {
        slide.style.display = 'none';
      });
      
      // Afficher la slide actuelle
      slides[index].style.display = 'block';
      
      // Mettre à jour les points de pagination
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
    }
  });
}

// Fonction pour initialiser le style livre/magazine
function initBookStyle() {
  const books = document.querySelectorAll('.book-container');
  
  books.forEach(book => {
    const spreads = book.querySelectorAll('.book-spread');
    const prevBtn = book.querySelector('.book-control.prev');
    const nextBtn = book.querySelector('.book-control.next');
    
    if (!spreads.length) return;
    
    let currentSpread = 0;
    
    // Afficher la première double-page
    showSpread(currentSpread);
    
    // Événements pour les boutons
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentSpread > 0) {
          currentSpread--;
          showSpread(currentSpread);
        }
      });
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (currentSpread < spreads.length - 1) {
          currentSpread++;
          showSpread(currentSpread);
        }
      });
    }
    
    function showSpread(index) {
      // Masquer toutes les doubles-pages
      spreads.forEach(spread => {
        spread.style.display = 'none';
      });
      
      // Afficher la double-page actuelle
      spreads[index].style.display = 'flex';
      
      // Mettre à jour l'état des boutons
      if (prevBtn) {
        prevBtn.disabled = index === 0;
      }
      
      if (nextBtn) {
        nextBtn.disabled = index === spreads.length - 1;
      }
    }
  });
}

// Fonction pour initialiser l'effet parallax au scroll
function initParallaxScroll() {
  const parallaxContainers = document.querySelectorAll('.parallax-container');
  
  parallaxContainers.forEach(container => {
    const mainImage = container.querySelector('.parallax-image.main');
    const bgImages = container.querySelectorAll('.parallax-image.background');
    
    if (!mainImage || !bgImages.length) return;
    
    // Appliquer l'effet parallax au scroll
    window.addEventListener('scroll', () => {
      const rect = container.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      
      if (isVisible) {
        const scrollPosition = window.scrollY;
        const containerTop = rect.top + scrollPosition;
        const scrollOffset = scrollPosition - containerTop;
        const scrollPercent = scrollOffset / rect.height;
        
        // Déplacer l'image principale
        mainImage.style.transform = `translateY(${scrollPercent * 20}px)`;
        
        // Déplacer les images d'arrière-plan à différentes vitesses
        bgImages.forEach((img, index) => {
          const factor = index === 0 ? -15 : -10;
          img.style.transform = `translateY(${scrollPercent * factor}px)`;
        });
      }
    });
  });
};

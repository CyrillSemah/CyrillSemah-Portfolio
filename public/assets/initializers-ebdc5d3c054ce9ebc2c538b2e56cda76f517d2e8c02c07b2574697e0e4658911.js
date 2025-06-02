// Fichier d'initialisation pour tous les effets JavaScript

document.addEventListener('DOMContentLoaded', function() {
  console.log('Initialisation de tous les effets JavaScript...');
  
  // Initialiser l'effet de grille d'arrière-plan
  if (typeof initializeGridBackgroundEffect === 'function') {
    console.log('Initialisation de l\'effet de grille d\'arrière-plan');
    initializeGridBackgroundEffect();
  }
  
  // Initialiser les effets de changement de couleur au scroll
  if (typeof initScrollColorChange === 'function') {
    console.log('Initialisation des effets de changement de couleur au scroll');
    initScrollColorChange();
  }
  
  // Initialiser l'effet 3D pour la section home
  if (typeof init3DEffect === 'function') {
    console.log('Initialisation de l\'effet 3D pour la section home');
    init3DEffect();
  }
  
  // Initialiser les effets de transition entre sections
  if (typeof initSectionTransitions === 'function') {
    console.log('Initialisation des effets de transition entre sections');
    initSectionTransitions();
  }
  
  // Initialiser les effets pour les projets
  if (typeof initBeforeAfterSliders === 'function') {
    console.log('Initialisation des réglettes avant/après pour la photographie');
    initBeforeAfterSliders();
  }
  
  if (typeof initCarousels === 'function') {
    console.log('Initialisation des carrousels pour les maquettes');
    initCarousels();
  }
  
  if (typeof initBookStyle === 'function') {
    console.log('Initialisation du style livre/magazine pour les maquettes');
    initBookStyle();
  }
  
  if (typeof initParallaxScroll === 'function') {
    console.log('Initialisation de l\'effet parallax au scroll pour les maquettes');
    initParallaxScroll();
  }
  
  // Initialiser les animations au scroll
  if (typeof initAnimationScroll === 'function') {
    console.log('Initialisation des animations au scroll');
    initAnimationScroll();
  }
  
  // Initialiser le menu burger
  const burger = document.querySelector('.navbar__burger');
  const mobileMenu = document.querySelector('.navbar__mobile');
  
  if (burger && mobileMenu) {
    console.log('Initialisation du menu burger');
    burger.addEventListener('click', function() {
      this.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.classList.toggle('no-scroll');
    });
  }
  
  // Initialiser les cartes de compétences
  if (typeof initSkillCards === 'function') {
    console.log('Initialisation des cartes de compétences');
    initSkillCards();
  }
  
  console.log('Tous les effets JavaScript ont été initialisés');
});

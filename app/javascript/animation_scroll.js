// Script pour animer les éléments au scroll avec effet réversible amélioré
document.addEventListener('DOMContentLoaded', () => {
  // Utilisation de console.info pour réduire la verbosité et les erreurs potentielles
  console.info('Script d\'animation réversible amélioré au scroll chargé');
  
  // Variables pour détecter la direction du défilement
  let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
  let scrollDirection = 'down'; // Par défaut, on considère qu'on défile vers le bas
  
  // Détection de la direction du défilement
  window.addEventListener('scroll', () => {
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    scrollDirection = currentScrollTop > lastScrollTop ? 'down' : 'up';
    lastScrollTop = currentScrollTop;
  });
  
  // Fonction d'animation réutilisable pour différentes sections
  const setupCardAnimations = (cardSelector) => {
    // Sélectionner toutes les cartes
    const cards = document.querySelectorAll(cardSelector);
    
    // Si aucune carte n'est trouvée, ne pas continuer
    if (cards.length === 0) return;
    
    // Détecter si on est sur mobile
    const isMobile = window.innerWidth <= 675;
    
    // Configuration de l'observateur adaptée selon le type d'appareil
    const observerOptions = {
      // Juste milieu pour que les cartes apparaissent au bon moment
      threshold: isMobile ? 0.08 : 0.2,
      rootMargin: isMobile ? '0px 0px -10px 0px' : '0px 0px -50px 0px' // Valeurs intermédiaires
    };

    // Créer l'observateur avec gestion des animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // Délai réduit sur mobile pour une meilleure réactivité
        const delay = isMobile ? 50 : Array.from(cards).indexOf(entry.target) * 100;
        
        if (entry.isIntersecting) {
          // Animation d'entrée avec délai progressif
          setTimeout(() => {
            entry.target.classList.add('animate-in');
            entry.target.classList.remove('animate-out');
          }, delay);
        } else {
          // Animation inversée uniquement lors du défilement vers le haut
          if (scrollDirection === 'up') {
            entry.target.classList.remove('animate-in');
            entry.target.classList.add('animate-out');
          }
        }
      });
    }, observerOptions);

    // Observer chaque carte avec un délai initial pour éviter les animations au chargement
    setTimeout(() => {
      cards.forEach(card => observer.observe(card));
    }, isMobile ? 100 : 300);
  };
  
  // Animer les cartes d'entreprise (section expériences professionnelles)
  setupCardAnimations('.company-card');
  
  // Animer les cartes d'école (section éducation)
  setupCardAnimations('.school-card');
  
  // Animer les groupes de compétences avec effet de zoom
  setupCardAnimations('.skills-group');
});

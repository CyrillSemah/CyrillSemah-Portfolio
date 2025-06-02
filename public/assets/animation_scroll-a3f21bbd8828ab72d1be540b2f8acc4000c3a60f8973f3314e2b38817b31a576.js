// Script pour animer les éléments au scroll avec effet réversible amélioré
document.addEventListener('DOMContentLoaded', () => {
  // Utilisation de console.info pour réduire la verbosité et les erreurs potentielles
  console.info('Script d\'animation réversible amélioré au scroll chargé');
  
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
      // Sur mobile: déclencher plus tôt et avec une marge plus petite
      threshold: isMobile ? 0.1 : 0.3,
      rootMargin: isMobile ? '0px 0px -50px 0px' : '0px 0px -150px 0px'
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
          // Sur mobile, ne pas animer la sortie pour éviter les problèmes
          if (!isMobile) {
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
});

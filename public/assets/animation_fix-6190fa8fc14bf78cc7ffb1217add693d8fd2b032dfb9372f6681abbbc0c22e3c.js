// Script pour corriger les problèmes d'animation et d'affichage
document.addEventListener('DOMContentLoaded', () => {
  console.info('Correctifs d\'animation chargés');
  
  // Fonction pour forcer l'affichage des cartes d'expérience
  const forceShowExperienceCards = () => {
    const companyCards = document.querySelectorAll('.company-card');
    const schoolCards = document.querySelectorAll('.school-card');
    const skillItems = document.querySelectorAll('.skill-item');
    const softSkillItems = document.querySelectorAll('.soft-skill-item');
    
    // Fonction pour animer progressivement les éléments
    const animateWithDelay = (elements, baseDelay = 100) => {
      elements.forEach((element, index) => {
        setTimeout(() => {
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
          element.classList.add('animate-in');
          element.classList.remove('animate-out');
        }, index * baseDelay);
      });
    };
    
    // Animer les différents types de cartes
    animateWithDelay(companyCards, 150);
    animateWithDelay(schoolCards, 150);
    animateWithDelay(skillItems, 100);
    animateWithDelay(softSkillItems, 100);
    
    // Assurer que les éléments internes sont également visibles
    document.querySelectorAll('.experience-item, .education-item').forEach(item => {
      item.style.opacity = '1';
    });
  };
  
  // Fonction pour corriger le hover dans la navbar
  const fixNavbarHover = () => {
    const navLinks = document.querySelectorAll('.navbar__links a');
    
    navLinks.forEach(link => {
      // Réinitialiser les styles
      link.style.position = 'relative';
      
      // Ajouter un effet de hover personnalisé
      link.addEventListener('mouseenter', () => {
        if (!link.classList.contains('js-contact-modal')) {
          link.style.color = '#2b3f8a';
        }
      });
      
      link.addEventListener('mouseleave', () => {
        if (!link.classList.contains('active') && !link.classList.contains('js-contact-modal')) {
          link.style.color = '';
        }
      });
    });
  };
  
  // Fonction pour corriger l'affichage des titres de section
  const fixSectionTitles = () => {
    const sectionTitles = document.querySelectorAll('.section h2');
    
    sectionTitles.forEach(title => {
      title.style.zIndex = '10';
      title.style.position = 'relative';
    });
  };
  
  // Exécuter les correctifs après un court délai pour s'assurer que le DOM est complètement chargé
  setTimeout(() => {
    forceShowExperienceCards();
    fixNavbarHover();
    fixSectionTitles();
    
    // Forcer un rafraîchissement du scroll pour déclencher les animations
    window.scrollBy(0, 1);
    setTimeout(() => window.scrollBy(0, -1), 100);
  }, 500);
});

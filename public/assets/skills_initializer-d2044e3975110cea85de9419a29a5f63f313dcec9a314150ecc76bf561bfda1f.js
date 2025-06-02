// Script pour initialiser les animations et interactions des compétences
document.addEventListener('DOMContentLoaded', () => {
  console.info('Initialisation des compétences...');
  
  // Fonction pour initialiser les animations des compétences
  const initializeSkillsAnimations = () => {
    // Sélection des éléments
    const skillItems = document.querySelectorAll('.skill-item');
    const softSkillItems = document.querySelectorAll('.soft-skill-item');
    
    // Appliquer une rotation aléatoire aux cartes de compétences
    skillItems.forEach(item => {
      const rotation = item.getAttribute('data-rotation') || 0;
      item.style.transform = `rotate(${rotation}deg)`;
      
      // Ajouter l'interaction au clic pour afficher la description
      item.addEventListener('click', () => {
        const description = item.querySelector('.skill-description');
        if (description) {
          if (description.style.display === 'none' || description.style.display === '') {
            description.style.display = 'block';
            // Ajouter une classe pour l'animation
            description.classList.add('show-description');
          } else {
            description.classList.remove('show-description');
            // Utiliser setTimeout pour permettre l'animation de sortie
            setTimeout(() => {
              description.style.display = 'none';
            }, 300);
          }
        }
      });
    });
    
    // Animation d'entrée pour les compétences avec délai progressif
    const animateSkillsWithDelay = () => {
      skillItems.forEach((item, index) => {
        setTimeout(() => {
          item.classList.add('animate-in');
        }, index * 100);
      });
      
      softSkillItems.forEach((item, index) => {
        setTimeout(() => {
          item.classList.add('animate-in');
        }, index * 100 + 500); // Délai supplémentaire pour les soft skills
      });
    };
    
    // Exécuter l'animation après un court délai
    setTimeout(animateSkillsWithDelay, 500);
  };
  
  // Initialiser les animations des compétences
  initializeSkillsAnimations();
});

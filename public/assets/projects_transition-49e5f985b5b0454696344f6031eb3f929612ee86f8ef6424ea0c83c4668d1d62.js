// Script pour gérer la transition en fondu enchaîné des projets
document.addEventListener('DOMContentLoaded', () => {
  console.info('Script de transition des projets chargé');
  
  // Sélection des éléments principaux
  const mainSections = document.querySelector('.main-sections');
  const projectsSection = document.getElementById('projects-section');
  
  // Vérifier que les éléments existent
  if (!mainSections || !projectsSection) {
    console.error('Éléments nécessaires non trouvés pour la transition des projets');
    return;
  }
  
  // Configurer les styles initiaux
  projectsSection.style.transition = 'opacity 0.8s ease';
  mainSections.style.transition = 'opacity 0.8s ease';
  
  // Fonction pour animer la navbar en mode projets
  const animateNavbarToProjectsMode = () => {
    const navbar = document.querySelector('.navbar');
    navbar.classList.remove('projects-mode-out');
    navbar.classList.add('projects-mode-in');
    
    // Après l'animation, ajouter la classe finale
    setTimeout(() => {
      navbar.classList.remove('projects-mode-in');
      navbar.classList.add('projects-mode');
    }, 500);
  };
  
  // Fonction pour animer la navbar en mode normal
  const animateNavbarToNormalMode = () => {
    const navbar = document.querySelector('.navbar');
    navbar.classList.remove('projects-mode');
    navbar.classList.add('projects-mode-out');
    
    // Après l'animation, supprimer toutes les classes
    setTimeout(() => {
      navbar.classList.remove('projects-mode-out');
    }, 500);
  };
  
  // Fonction pour afficher les projets avec une transition
  const showProjects = () => {
    // Masquer les sections principales avec une transition
    mainSections.style.opacity = '0';
    
    // Animer la navbar en mode projets
    animateNavbarToProjectsMode();
    
    // Après la transition de disparition, afficher les projets
    setTimeout(() => {
      mainSections.style.display = 'none';
      
      // Afficher la section des projets
      projectsSection.style.display = 'block';
      
      // Forcer un reflow pour que la transition fonctionne
      void projectsSection.offsetWidth;
      
      // Afficher les projets avec une transition
      projectsSection.style.opacity = '1';
      
      // Mettre à jour la classe active dans la navbar
      updateActiveNavLink('projects');
      
      // Faire défiler vers le haut
      window.scrollTo(0, 0);
    }, 800);
  };
  
  // Fonction pour masquer les projets et revenir au portfolio
  const hideProjects = () => {
    // Masquer les projets avec une transition
    projectsSection.style.opacity = '0';
    
    // Animer la navbar en mode normal
    animateNavbarToNormalMode();
    
    // Après la transition de disparition, afficher les sections principales
    setTimeout(() => {
      projectsSection.style.display = 'none';
      
      // Afficher les sections principales
      mainSections.style.display = 'block';
      
      // Forcer un reflow pour que la transition fonctionne
      void mainSections.offsetWidth;
      
      // Afficher les sections principales avec une transition
      mainSections.style.opacity = '1';
      
      // Mettre à jour la classe active dans la navbar
      updateActiveNavLink('home');
    }, 800);
  };
  
  // Fonction pour mettre à jour le lien actif dans la navbar
  const updateActiveNavLink = (activePage) => {
    const navLinks = document.querySelectorAll('.navbar__links a');
    navLinks.forEach(link => {
      link.classList.remove('active');
      
      if (activePage === 'projects' && link.classList.contains('js-projects-link')) {
        link.classList.add('active');
      } else if (activePage === 'home' && link.getAttribute('href') === '#home') {
        link.classList.add('active');
      }
    });
  };
  
  // Intercepter les clics sur les liens de la navbar
  const navLinks = document.querySelectorAll('.navbar__links a');
  navLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      // Si c'est le lien Projets
      if (link.classList.contains('js-projects-link')) {
        event.preventDefault();
        showProjects();
      }
      // Si c'est un lien vers une section du portfolio et que les projets sont affichés
      else if (link.getAttribute('href').startsWith('#') && projectsSection.style.display === 'block') {
        event.preventDefault();
        
        // Masquer les projets et revenir au portfolio
        hideProjects();
        
        // Après la transition, faire défiler jusqu'à la section
        setTimeout(() => {
          const targetSection = document.querySelector(link.getAttribute('href'));
          if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
          }
        }, 1000);
      }
    });
  });
  
  // Gérer le clic sur le bouton "Retour au portfolio"
  const backButton = projectsSection.querySelector('.btn-back-to-portfolio');
  if (backButton) {
    backButton.addEventListener('click', (event) => {
      event.preventDefault();
      hideProjects();
    });
  }
});

// Script pour gérer la transition en fondu enchaîné des projets
document.addEventListener('DOMContentLoaded', () => {
  console.info('Script de transition des projets chargé');
  
  // Conteneur principal qui contiendra toutes les sections
  const mainContainer = document.querySelector('main');
  
  // Conteneur pour les projets qui sera affiché/masqué
  let projectsContainer = document.querySelector('.projects-container');
  if (!projectsContainer) {
    projectsContainer = document.createElement('div');
    projectsContainer.className = 'projects-container';
    projectsContainer.style.display = 'none';
    projectsContainer.style.opacity = '0';
    projectsContainer.style.position = 'fixed';
    projectsContainer.style.top = '0';
    projectsContainer.style.left = '0';
    projectsContainer.style.width = '100%';
    projectsContainer.style.height = '100%';
    projectsContainer.style.backgroundColor = '#eeedec';
    projectsContainer.style.zIndex = '900';
    projectsContainer.style.overflow = 'auto';
    projectsContainer.style.paddingTop = '80px'; // Pour compenser la navbar
    projectsContainer.style.transition = 'opacity 0.8s ease';
    mainContainer.appendChild(projectsContainer);
  }
  
  // Sections du portfolio
  const portfolioSections = document.querySelectorAll('.section:not(.projects-container)');
  
  // Fonction pour charger les projets via AJAX
  const loadProjects = () => {
    // Afficher un indicateur de chargement
    projectsContainer.innerHTML = '<div class="loading-spinner" style="text-align: center; padding: 50px;"><i class="fas fa-spinner fa-spin fa-3x"></i><p>Chargement des projets...</p></div>';
    
    // Faire une requête AJAX pour récupérer les projets
    fetch('/projects')
      .then(response => response.text())
      .then(html => {
        // Extraire le contenu principal de la réponse HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const content = doc.querySelector('.section-projects');
        
        // Injecter le contenu dans le conteneur des projets
        if (content) {
          projectsContainer.innerHTML = '';
          projectsContainer.appendChild(content);
        } else {
          projectsContainer.innerHTML = '<div class="error-message" style="text-align: center; padding: 50px;"><p>Impossible de charger les projets.</p></div>';
        }
      })
      .catch(error => {
        console.error('Erreur lors du chargement des projets:', error);
        projectsContainer.innerHTML = '<div class="error-message" style="text-align: center; padding: 50px;"><p>Erreur lors du chargement des projets.</p></div>';
      });
  };
  
  // Fonction pour afficher les projets avec une transition
  const showProjects = () => {
    // Masquer les sections du portfolio avec une transition
    portfolioSections.forEach(section => {
      section.style.transition = 'opacity 0.8s ease';
      section.style.opacity = '0';
    });
    
    // Après la transition de disparition, afficher les projets
    setTimeout(() => {
      portfolioSections.forEach(section => {
        section.style.display = 'none';
      });
      
      // Afficher le conteneur des projets
      projectsContainer.style.display = 'block';
      
      // Forcer un reflow pour que la transition fonctionne
      void projectsContainer.offsetWidth;
      
      // Afficher les projets avec une transition
      projectsContainer.style.opacity = '1';
      
      // Mettre à jour l'URL sans recharger la page
      history.pushState({page: 'projects'}, 'Projets', '/projects');
      
      // Mettre à jour la classe active dans la navbar
      updateActiveNavLink('projects');
    }, 800);
  };
  
  // Fonction pour masquer les projets et revenir au portfolio
  const hideProjects = () => {
    // Masquer les projets avec une transition
    projectsContainer.style.opacity = '0';
    
    // Après la transition de disparition, afficher les sections du portfolio
    setTimeout(() => {
      projectsContainer.style.display = 'none';
      
      // Afficher les sections du portfolio
      portfolioSections.forEach(section => {
        section.style.display = '';
      });
      
      // Forcer un reflow pour que la transition fonctionne
      void portfolioSections[0].offsetWidth;
      
      // Afficher les sections avec une transition
      portfolioSections.forEach(section => {
        section.style.opacity = '1';
      });
      
      // Mettre à jour l'URL sans recharger la page
      history.pushState({page: 'home'}, 'Accueil', '/');
      
      // Mettre à jour la classe active dans la navbar
      updateActiveNavLink('home');
    }, 800);
  };
  
  // Fonction pour mettre à jour le lien actif dans la navbar
  const updateActiveNavLink = (activePage) => {
    const navLinks = document.querySelectorAll('.navbar__links a');
    navLinks.forEach(link => {
      link.classList.remove('active');
      
      if (activePage === 'projects' && link.textContent.trim() === 'Projets') {
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
      const href = link.getAttribute('href');
      
      // Si c'est le lien Projets
      if (link.textContent.trim() === 'Projets') {
        event.preventDefault();
        
        // Charger les projets si ce n'est pas déjà fait
        if (projectsContainer.children.length === 0) {
          loadProjects();
        }
        
        // Afficher les projets avec une transition
        showProjects();
      }
      // Si c'est un lien vers une section du portfolio et que les projets sont affichés
      else if (href.startsWith('#') && projectsContainer.style.display === 'block' && projectsContainer.style.opacity === '1') {
        event.preventDefault();
        
        // Masquer les projets et revenir au portfolio
        hideProjects();
        
        // Après la transition, faire défiler jusqu'à la section
        setTimeout(() => {
          const targetSection = document.querySelector(href);
          if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
          }
        }, 1000);
      }
    });
  });
  
  // Gérer le bouton retour du navigateur
  window.addEventListener('popstate', (event) => {
    if (projectsContainer.style.display === 'block' && projectsContainer.style.opacity === '1') {
      hideProjects();
    }
  });
});

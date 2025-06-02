// Point d'entrée principal pour l'application JavaScript
import './disable_inspector'; // Désactive l'inspecteur qui cause les erreurs
import './css_fix';
import './projects_transition'; // Transition en fondu enchaîné pour les projets
import './project_details'; // Affichage des détails des projets
import './scroll_color_change';
import './animation_scroll';
import './contact_form';
import './projects_transition'; // Transition en fondu enchaîné pour les projets
import './delete_confirmation';
import './notifications';
import './tag_cloud';
import './home_3d_effect'; // Effet 3D pour la section home
import './kebab_menu'; // Menu kebab pour les actions
import './toggle_group'; // Réduction/expansion des groupes
import './image_modal'; // Gestion des modales d'images pour les formations
import './section_transition'; // Effet de transition entre les sections
import './tag_canvas_fix'; // Correctif pour les événements non passifs de TagCanvas

document.addEventListener('DOMContentLoaded', function() {
  console.info('Application JavaScript chargée avec succès');
  
  // Gestion du menu burger
  const burger = document.querySelector('.navbar__burger');
  const mobileMenu = document.querySelector('.navbar__mobile');
  
  if (burger && mobileMenu) {
    burger.addEventListener('click', function() {
      this.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.classList.toggle('no-scroll');
    });
  }
  
  // Fonction pour faire défiler vers une section
  function scrollToSection(sectionId) {
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      // Fermer le menu mobile si ouvert
      if (mobileMenu && mobileMenu.classList.contains('active')) {
        burger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.classList.remove('no-scroll');
      }
      
      // Faire défiler jusqu'à la section
      window.scrollTo({
        top: targetSection.offsetTop - 80, // Ajuster pour la hauteur de la navbar
        behavior: 'smooth'
      });
      
      // Mettre à jour les classes actives
      updateActiveLinks('#' + sectionId);
    }
  }
  
  // Fonction pour mettre à jour les liens actifs
  function updateActiveLinks(href) {
    const navLinks = document.querySelectorAll('.navbar__links a, .navbar__mobile a');
    navLinks.forEach(link => link.classList.remove('active'));
    
    document.querySelectorAll(`a[href="${href}"]`).forEach(link => {
      link.classList.add('active');
    });
  }
  
  // Gestion des liens de navigation
  document.querySelectorAll('.navbar__links a, .navbar__mobile a').forEach(link => {
    link.addEventListener('click', function(e) {
      // Ne pas traiter les liens spéciaux (contact, admin, etc.)
      if (this.classList.contains('js-contact-modal') || this.getAttribute('href').indexOf('admin') !== -1) {
        return;
      }
      
      const href = this.getAttribute('href');
      
      // Si c'est un lien avec ancre
      if (href.startsWith('#')) {
        e.preventDefault();
        const sectionId = href.substring(1);
        scrollToSection(sectionId);
        
        // Mettre à jour l'URL sans recharger la page
        history.pushState(null, null, href);
      }
    });
  });
  
  // Gestion spéciale pour le lien Accueil
  document.querySelectorAll('a[href="#home"]').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      scrollToSection('home');
      history.pushState(null, null, '#home');
    });
  });
  
  // Vérifier si on est sur la page d'accueil et activer le lien Accueil
  if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
    updateActiveLinks('#home');
  }
  
  // Gestion du modal de contact
  const contactButtons = document.querySelectorAll('.js-contact-modal');
  const modal = document.querySelector('.contact-modal');
  const closeModal = document.querySelector('.contact-modal__close');
  
  if (contactButtons.length > 0 && modal) {
    contactButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        modal.classList.add('active');
        document.body.classList.add('no-scroll');
      });
    });
    
    if (closeModal) {
      closeModal.addEventListener('click', function() {
        modal.classList.remove('active');
        document.body.classList.remove('no-scroll');
      });
    }
    
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.classList.remove('no-scroll');
      }
    });
  }
});

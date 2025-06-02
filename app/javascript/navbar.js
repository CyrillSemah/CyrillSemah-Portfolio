// Gestion de la navbar
document.addEventListener('DOMContentLoaded', function() {
  // Éléments DOM
  const navbarBurger = document.querySelector('.navbar__burger');
  const navbarMobile = document.querySelector('.navbar__mobile');
  const navLinks = document.querySelectorAll('.navbar__links a:not(.btn-contact), .navbar__mobile a:not(.btn-contact)');
  
  // Gestion du menu burger
  navbarBurger.addEventListener('click', function() {
    this.classList.toggle('active');
    navbarMobile.classList.toggle('active');
    document.body.classList.toggle('no-scroll'); // Empêcher le défilement quand le menu est ouvert
  });
  
  // Fermer le menu mobile lors du clic sur un lien
  document.querySelectorAll('.navbar__mobile a').forEach(link => {
    link.addEventListener('click', function() {
      navbarBurger.classList.remove('active');
      navbarMobile.classList.remove('active');
      document.body.classList.remove('no-scroll');
    });
  });
  
  // Gestion des liens actifs en fonction du scroll
  function setActiveLink() {
    const scrollPosition = window.scrollY;
    
    // Récupérer toutes les sections
    const sections = document.querySelectorAll('section[id]');
    
    // Parcourir les sections pour trouver celle qui est visible
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100; // Offset pour tenir compte de la hauteur de la navbar
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        // Désactiver tous les liens
        navLinks.forEach(link => {
          link.classList.remove('active');
        });
        
        // Activer le lien correspondant à la section visible
        document.querySelectorAll(`a[href="#${sectionId}"]`).forEach(link => {
          link.classList.add('active');
        });
      }
    });
  }
  
  // Écouter l'événement de scroll
  window.addEventListener('scroll', setActiveLink);
  
  // Appeler la fonction au chargement de la page
  setActiveLink();
});

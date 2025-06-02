// JavaScript pour le menu kebab

// Rendre les fonctions accessibles globalement
window.toggleKebabMenu = function(button, event) {
  // Empêcher la propagation de l'événement
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  
  // Fermer tous les autres menus kebab d'abord
  closeAllKebabMenus();
  
  // Ouvrir le menu actuel
  const menu = button.nextElementSibling;
  if (menu) {
    menu.classList.toggle('show');
    
    // Ajouter/supprimer la classe active sur le bouton
    button.classList.toggle('active');
    
    // Afficher l'overlay si le menu est ouvert
    if (menu.classList.contains('show')) {
      const overlay = document.querySelector('.kebab-menu-overlay');
      if (overlay) {
        overlay.classList.add('show');
      }
    }
  }
};

function closeAllKebabMenus() {
  // Cacher tous les menus
  document.querySelectorAll('.kebab-menu__content').forEach(function(menu) {
    menu.classList.remove('show');
  });
  
  // Supprimer la classe active de tous les boutons
  document.querySelectorAll('.kebab-menu__button').forEach(function(button) {
    button.classList.remove('active');
  });
  
  // Cacher l'overlay
  const overlay = document.querySelector('.kebab-menu-overlay');
  if (overlay) {
    overlay.classList.remove('show');
  }
}

document.addEventListener('DOMContentLoaded', function() {
  // Ajouter un overlay au body pour fermer le menu en cliquant en dehors
  const overlay = document.createElement('div');
  overlay.className = 'kebab-menu-overlay';
  document.body.appendChild(overlay);
  
  // Fermer tous les menus ouverts quand on clique sur l'overlay
  overlay.addEventListener('click', function() {
    closeAllKebabMenus();
  });
  
  // Ajouter les écouteurs d'événements pour les boutons kebab des groupes
  document.querySelectorAll('.kebab-menu__button[data-action="toggle-kebab"]').forEach(function(button) {
    button.addEventListener('click', function(event) {
      toggleKebabMenu(this, event);
    });
  });
  
  // Ajouter les écouteurs d'événements pour les boutons kebab des compétences
  document.querySelectorAll('.kebab-menu__button[data-action="toggle-skill-kebab"]').forEach(function(button) {
    button.addEventListener('click', function(event) {
      toggleKebabMenu(this, event);
    });
  });
  
  // Ajouter les écouteurs d'événements pour les boutons kebab des soft-skills
  document.querySelectorAll('.kebab-menu__button[data-action="toggle-soft-skill-kebab"]').forEach(function(button) {
    button.addEventListener('click', function(event) {
      toggleKebabMenu(this, event);
    });
  });
  
  // Ajouter des écouteurs d'événements pour les éléments du menu kebab
  document.querySelectorAll('.kebab-menu__content .menu-item:not(.btn-delete)').forEach(function(item) {
    item.addEventListener('click', function(event) {
      // Ne pas fermer le menu si on clique sur un élément du menu
      event.stopPropagation();
    });
  });
  
  // Réinitialiser les écouteurs d'événements pour les boutons de suppression
  function setupDeleteButtons() {
    if (window.setupDeleteButtonsFunction) {
      window.setupDeleteButtonsFunction();
    }
  }
  
  // Appeler la fonction après l'initialisation des menus kebab
  setTimeout(setupDeleteButtons, 100);
});

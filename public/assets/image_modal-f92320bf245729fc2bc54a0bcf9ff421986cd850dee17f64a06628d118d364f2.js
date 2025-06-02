// Gestion des modales d'images pour les formations
document.addEventListener('DOMContentLoaded', function() {
  // Sélectionner tous les éléments de galerie
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  // Pour chaque élément de galerie, ajouter un écouteur d'événements
  galleryItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const imageId = this.getAttribute('data-image-id');
      const modal = document.getElementById('modal-' + imageId);
      
      if (modal) {
        // Afficher la modale sans bloquer le défilement
        modal.classList.add('show');
        
        // Gérer la fermeture de la modale
        const closeBtn = modal.querySelector('.close-modal');
        
        // Fonction de fermeture
        const closeModal = function(e) {
          if (e) {
            e.preventDefault();
            e.stopPropagation();
          }
          
          // Cacher la modale
          modal.classList.remove('show');
          
          // Nettoyer les écouteurs d'événements
          closeBtn.removeEventListener('click', closeModal);
          document.removeEventListener('keydown', handleKeyDown);
          modal.removeEventListener('click', handleOutsideClick);
        };
        
        // Fermer avec le bouton de fermeture
        closeBtn.addEventListener('click', closeModal);
        
        // Fermer avec la touche Échap
        const handleKeyDown = function(e) {
          if (e.key === 'Escape') {
            closeModal(e);
          }
        };
        document.addEventListener('keydown', handleKeyDown);
        
        // Fermer en cliquant en dehors de l'image
        const handleOutsideClick = function(e) {
          // Vérifier si le clic est sur la modale mais pas sur son contenu
          if (e.target === modal) {
            closeModal(e);
          }
        };
        modal.addEventListener('click', handleOutsideClick);
      }
    });
  });
});

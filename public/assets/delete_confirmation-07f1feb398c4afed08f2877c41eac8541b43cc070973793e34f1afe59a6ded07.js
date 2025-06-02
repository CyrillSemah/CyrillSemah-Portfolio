// Gestion de la modale de confirmation de suppression
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('deleteConfirmationModal');
  const deleteButtons = document.querySelectorAll('.btn-delete-experience, .btn-delete-education, .btn-delete-skill, .btn-delete-skill-group');
  const cancelButton = document.getElementById('cancelDeleteBtn');
  const confirmButton = document.getElementById('confirmDeleteBtn');
  const closeModalButton = document.querySelector('.delete-confirmation-modal .close-modal');
  
  let currentDeleteUrl = '';
  
  // Ouvrir la modale lors du clic sur un bouton de suppression
  function setupDeleteButtons() {
    document.querySelectorAll('.btn-delete-experience, .btn-delete-education, .btn-delete-skill, .btn-delete-skill-group').forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        currentDeleteUrl = this.getAttribute('data-delete-url');
        
        // Afficher la modale
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Empêcher le défilement
      });
    });
  }
  
  // Initialiser les boutons de suppression
  setupDeleteButtons();
  
  // Fermer la modale lors du clic sur le bouton Annuler
  if (cancelButton) {
    cancelButton.addEventListener('click', () => {
      closeModal();
    });
  }
  
  // Fermer la modale lors du clic sur le bouton de fermeture
  if (closeModalButton) {
    closeModalButton.addEventListener('click', () => {
      closeModal();
    });
  }
  
  // Fermer la modale lors du clic en dehors de celle-ci
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }
  
  // Confirmer la suppression
  if (confirmButton) {
    confirmButton.addEventListener('click', () => {
      if (currentDeleteUrl) {
        // Créer un formulaire pour soumettre la requête DELETE
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = currentDeleteUrl;
        form.style.display = 'none';
        
        // Ajouter le token CSRF
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        const csrfInput = document.createElement('input');
        csrfInput.type = 'hidden';
        csrfInput.name = 'authenticity_token';
        csrfInput.value = csrfToken;
        form.appendChild(csrfInput);
        
        // Ajouter la méthode DELETE
        const methodInput = document.createElement('input');
        methodInput.type = 'hidden';
        methodInput.name = '_method';
        methodInput.value = 'delete';
        form.appendChild(methodInput);
        
        // Ajouter le formulaire au document et le soumettre
        document.body.appendChild(form);
        form.submit();
      }
    });
  }
  
  // Fonction pour fermer la modale
  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Réactiver le défilement
    currentDeleteUrl = '';
  }
});

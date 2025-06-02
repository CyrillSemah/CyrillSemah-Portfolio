// Gestion de la modale de confirmation de suppression
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('deleteConfirmationModal');
  const deleteButtons = document.querySelectorAll('.btn-delete-experience, .btn-delete-education, .btn-delete-skill, .btn-delete-skill-group, .btn-delete-soft-skill');
  const cancelButton = document.getElementById('cancelDeleteBtn');
  const confirmButton = document.getElementById('confirmDeleteBtn');
  const closeModalButton = document.querySelector('.delete-confirmation-modal .close-modal');
  
  let currentDeleteUrl = '';
  
  // Ouvrir la modale lors du clic sur un bouton de suppression
  function setupDeleteButtons() {
    document.querySelectorAll('.btn-delete-experience, .btn-delete-education, .btn-delete-skill, .btn-delete-skill-group, .btn-delete-soft-skill, .btn-delete-section').forEach(button => {
      // Supprimer les écouteurs d'événements existants pour éviter les doublons
      button.removeEventListener('click', handleDeleteButtonClick);
      // Ajouter le nouvel écouteur d'événements
      button.addEventListener('click', handleDeleteButtonClick);
    });
  }
  
  // Fonction de gestion du clic sur un bouton de suppression
  function handleDeleteButtonClick(e) {
    e.preventDefault();
    currentDeleteUrl = this.getAttribute('data-delete-url');
    
    // Personnaliser le texte de la modale en fonction du type d'élément
    const warningMessage = modal.querySelector('.warning-message');
    const warningDetails = modal.querySelector('.warning-details');
    
    if (this.classList.contains('btn-delete-skill-group')) {
      // Groupe de compétences
      if (warningMessage) warningMessage.textContent = 'Êtes-vous sûr de vouloir supprimer ce groupe de compétences ?';
      if (warningDetails) warningDetails.textContent = 'Les informations de ce groupe de compétences seront définitivement supprimées et ne pourront pas être récupérées.';
    } else if (this.classList.contains('btn-delete-skill')) {
      // Compétence technique
      if (warningMessage) warningMessage.textContent = 'Êtes-vous sûr de vouloir supprimer cette compétence ?';
      if (warningDetails) warningDetails.textContent = 'Les informations de cette compétence seront définitivement supprimées et ne pourront pas être récupérées.';
    } else if (this.classList.contains('btn-delete-soft-skill')) {
      // Compétence personnelle
      if (warningMessage) warningMessage.textContent = 'Êtes-vous sûr de vouloir supprimer cette compétence personnelle ?';
      if (warningDetails) warningDetails.textContent = 'Les informations de cette compétence personnelle seront définitivement supprimées et ne pourront pas être récupérées.';
    } else if (this.classList.contains('btn-delete-education')) {
      // Formation
      if (warningMessage) warningMessage.textContent = 'Êtes-vous sûr de vouloir supprimer cette formation ?';
      if (warningDetails) warningDetails.textContent = 'Les informations de cette formation seront définitivement supprimées et ne pourront pas être récupérées.';
    } else if (this.classList.contains('btn-delete-section')) {
      // Section d'accueil
      if (warningMessage) warningMessage.textContent = 'Êtes-vous sûr de vouloir supprimer cette section d\'accueil ?';
      if (warningDetails) warningDetails.textContent = 'Les informations de cette section d\'accueil seront définitivement supprimées et ne pourront pas être récupérées.';
    } else {
      // Expérience ou autre
      if (warningMessage) warningMessage.textContent = 'Êtes-vous sûr de vouloir supprimer cette expérience ?';
      if (warningDetails) warningDetails.textContent = 'Les informations de cette expérience seront définitivement supprimées et ne pourront pas être récupérées.';
    }
    
    // Afficher la modale
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Empêcher le défilement
  }
  
  // Exposer la fonction setupDeleteButtons globalement
  window.setupDeleteButtonsFunction = setupDeleteButtons;
  
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

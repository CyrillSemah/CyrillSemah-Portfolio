// Gestion de la modal de contact
document.addEventListener('DOMContentLoaded', function() {
  // Éléments DOM
  const modal = document.getElementById('contactModal');
  const openButtons = document.querySelectorAll('.js-contact-modal');
  const closeButton = modal.querySelector('.modal-close');
  const contactForm = document.getElementById('contactForm');
  const formResponse = document.getElementById('formResponse');
  const successMessage = formResponse.querySelector('.success-message');
  const errorMessage = formResponse.querySelector('.error-message');
  
  // Ouvrir la modal
  openButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      modal.classList.add('active');
      document.body.style.overflow = 'hidden'; // Empêcher le défilement de la page
    });
  });
  
  // Fermer la modal
  closeButton.addEventListener('click', function() {
    closeModal();
  });
  
  // Fermer la modal en cliquant en dehors
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeModal();
    }
  });
  
  // Fermer la modal avec la touche Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
  
  // Fonction pour fermer la modal
  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Réactiver le défilement
    resetForm();
  }
  
  // Réinitialiser le formulaire et les messages
  function resetForm() {
    contactForm.reset();
    formResponse.style.display = 'none';
    successMessage.classList.remove('active');
    errorMessage.classList.remove('active');
  }
  
  // Soumission du formulaire
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Récupérer les données du formulaire
    const formData = new FormData(contactForm);
    
    // Désactiver le bouton d'envoi pendant la requête
    const submitButton = contactForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.innerHTML = 'Envoi en cours...';
    
    // Envoyer la requête AJAX
    fetch('/contact', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      // Afficher le message de réponse
      formResponse.style.display = 'block';
      
      if (data.success) {
        // Succès
        successMessage.classList.add('active');
        errorMessage.classList.remove('active');
        successMessage.querySelector('p').textContent = data.message;
        contactForm.style.display = 'none'; // Cacher le formulaire
      } else {
        // Erreur
        errorMessage.classList.add('active');
        successMessage.classList.remove('active');
        errorMessage.querySelector('p').textContent = data.message;
      }
    })
    .catch(error => {
      // Erreur de requête
      formResponse.style.display = 'block';
      errorMessage.classList.add('active');
      successMessage.classList.remove('active');
      errorMessage.querySelector('p').textContent = "Une erreur est survenue lors de l'envoi du message. Veuillez réessayer plus tard.";
      console.error('Erreur:', error);
    })
    .finally(() => {
      // Réactiver le bouton d'envoi
      submitButton.disabled = false;
      submitButton.innerHTML = 'Envoyer';
    });
  });
});

// Gestion du formulaire de contact avec notifications discrètes
document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contactForm');
  const formResponse = document.getElementById('formResponse');
  const successMessage = formResponse?.querySelector('.success-message p');
  const errorMessage = formResponse?.querySelector('.error-message p');
  const modal = document.getElementById('contactModal');

  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Afficher un indicateur de chargement
      const submitButton = this.querySelector('input[type="submit"]');
      const originalButtonText = submitButton.value;
      submitButton.value = 'Envoi en cours...';
      submitButton.disabled = true;
      
      // Récupérer les données du formulaire
      const formData = new FormData(this);
      
      // Envoyer les données via AJAX
      fetch(this.action, {
        method: 'POST',
        body: formData,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/json'
        },
        credentials: 'same-origin'
      })
      .then(response => response.json())
      .then(data => {
        // Réinitialiser le bouton
        submitButton.value = originalButtonText;
        submitButton.disabled = false;
        
        if (data.success) {
          // Afficher une notification de succès discrète
          const notification = document.createElement('div');
          notification.className = 'notification success';
          notification.innerHTML = `
            <div class="notification-content">
              <i class="fas fa-check-circle"></i>
              <p>${data.message}</p>
            </div>
          `;
          document.body.appendChild(notification);
          
          // Réinitialiser le formulaire
          contactForm.reset();
          
          // Fermer la modal après un court délai
          setTimeout(() => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
          }, 1500);
          
          // Supprimer la notification après quelques secondes
          setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
              notification.remove();
            }, 500);
          }, 3000);
        } else {
          // Afficher les erreurs
          const notification = document.createElement('div');
          notification.className = 'notification error';
          notification.innerHTML = `
            <div class="notification-content">
              <i class="fas fa-exclamation-circle"></i>
              <p>${data.errors.join('<br>')}</p>
            </div>
          `;
          document.body.appendChild(notification);
          
          // Supprimer la notification après quelques secondes
          setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
              notification.remove();
            }, 500);
          }, 5000);
        }
      })
      .catch(error => {
        // Réinitialiser le bouton
        submitButton.value = originalButtonText;
        submitButton.disabled = false;
        
        // Afficher une erreur générique
        const notification = document.createElement('div');
        notification.className = 'notification error';
        notification.innerHTML = `
          <div class="notification-content">
            <i class="fas fa-exclamation-circle"></i>
            <p>Une erreur est survenue lors de l'envoi du message. Veuillez réessayer.</p>
          </div>
        `;
        document.body.appendChild(notification);
        
        // Supprimer la notification après quelques secondes
        setTimeout(() => {
          notification.classList.add('fade-out');
          setTimeout(() => {
            notification.remove();
          }, 500);
        }, 5000);
        
        console.error('Erreur lors de l\'envoi du formulaire:', error);
      });
    });
  }
});

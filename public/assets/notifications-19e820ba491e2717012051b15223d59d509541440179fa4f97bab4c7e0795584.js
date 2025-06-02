// Système de notifications de style mobile
document.addEventListener('DOMContentLoaded', function() {
  // Fonction pour créer une notification
  function createNotification(message, type) {
    // Créer les éléments de la notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const content = document.createElement('div');
    content.className = 'notification-content';
    
    const icon = document.createElement('i');
    if (type === 'success') {
      icon.className = 'fas fa-check-circle';
    } else if (type === 'error') {
      icon.className = 'fas fa-exclamation-circle';
    } else {
      icon.className = 'fas fa-info-circle';
    }
    
    const text = document.createElement('p');
    text.textContent = message;
    
    // Assembler la notification
    content.appendChild(icon);
    content.appendChild(text);
    notification.appendChild(content);
    
    // Ajouter la notification au document
    document.body.appendChild(notification);
    
    // Faire disparaître la notification après 3 secondes
    setTimeout(function() {
      notification.classList.add('fade-out');
      setTimeout(function() {
        notification.remove();
      }, 500); // Attendre la fin de l'animation fade-out
    }, 3000);
    
    return notification;
  }
  
  // Convertir les alertes existantes en notifications
  function convertAlertsToNotifications() {
    // Trouver toutes les alertes
    const successAlerts = document.querySelectorAll('.alert.alert-success');
    const dangerAlerts = document.querySelectorAll('.alert.alert-danger');
    
    // Convertir les alertes de succès
    successAlerts.forEach(function(alert) {
      createNotification(alert.textContent, 'success');
      alert.remove();
    });
    
    // Convertir les alertes d'erreur
    dangerAlerts.forEach(function(alert) {
      createNotification(alert.textContent, 'error');
      alert.remove();
    });
  }
  
  // Exécuter la conversion
  convertAlertsToNotifications();
  
  // Exposer la fonction pour une utilisation ailleurs
  window.createNotification = createNotification;
});

// JavaScript pour la réduction/expansion des groupes de compétences

document.addEventListener('DOMContentLoaded', function() {
  // Ajouter les écouteurs d'événements pour les boutons de flèche
  document.querySelectorAll('.toggle-arrow[data-action="toggle-group"]').forEach(function(button) {
    button.addEventListener('click', function() {
      // Trouver le groupe parent
      const group = this.closest('.education-list__group');
      
      // Basculer la classe collapsed sur le groupe
      group.classList.toggle('collapsed');
      
      // Basculer la classe collapsed sur le bouton
      this.classList.toggle('collapsed');
      
      // Ajouter temporairement la classe active pour l'effet visuel
      this.classList.add('active');
      
      // Supprimer la classe active après un court délai
      setTimeout(() => {
        this.classList.remove('active');
      }, 300);
    });
  });
});

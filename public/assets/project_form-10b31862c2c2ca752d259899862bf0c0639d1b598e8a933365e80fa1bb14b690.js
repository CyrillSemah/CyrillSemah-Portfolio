// Gestion du formulaire de projet dynamique
document.addEventListener('DOMContentLoaded', function() {
  const categorySelect = document.getElementById('project-category-select');
  
  if (categorySelect) {
    // Fonction pour afficher les champs spécifiques à la catégorie sélectionnée
    function showCategoryFields(category) {
      // Masquer tous les champs spécifiques aux catégories
      document.querySelectorAll('.category-specific-fields').forEach(function(el) {
        el.style.display = 'none';
      });
      
      // Afficher les champs spécifiques à la catégorie sélectionnée
      if (category) {
        const categoryFields = document.getElementById(category + '-fields');
        if (categoryFields) {
          categoryFields.style.display = 'block';
        }
      }
    }
    
    // Initialiser l'affichage en fonction de la valeur actuelle
    showCategoryFields(categorySelect.value);
    
    // Mettre à jour l'affichage lorsque la catégorie change
    categorySelect.addEventListener('change', function() {
      showCategoryFields(this.value);
    });
  }
});

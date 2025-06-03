import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["visualType", "displayType", "visualImages", "beforeImageGroup", "afterImageGroup"]

  connect() {
    this.initializeVisualTypes();
  }

  initializeVisualTypes() {
    // Initialiser les champs visuels pour chaque formulaire de visuel
    this.visualTypeTargets.forEach(select => {
      this.toggleVisualTypeFields(select);
    });
  }

  toggleVisualType(event) {
    this.toggleVisualTypeFields(event.target);
  }

  toggleVisualTypeFields(select) {
    // Trouver le conteneur parent pour ce visuel spécifique
    const container = select.closest('.visual-form-container');
    if (!container) return;

    // Trouver les groupes d'images dans ce conteneur
    const beforeImageGroup = container.querySelector('.before-image-group');
    const afterImageGroup = container.querySelector('.after-image-group');
    
    if (!beforeImageGroup || !afterImageGroup) return;

    const visualType = select.value;
    
    if (visualType === 'before_after') {
      // Afficher les deux groupes d'images pour le type avant/après
      beforeImageGroup.style.display = 'block';
      afterImageGroup.style.display = 'block';
      
      // Mettre à jour les étiquettes
      beforeImageGroup.querySelector('label').textContent = 'Image avant';
      afterImageGroup.querySelector('label').textContent = 'Image après';
    } else {
      // Pour le type 'single', masquer le groupe d'image avant
      beforeImageGroup.style.display = 'none';
      afterImageGroup.style.display = 'block';
      
      // Mettre à jour l'étiquette pour l'image unique
      afterImageGroup.querySelector('label').textContent = 'Image';
    }
  }
}

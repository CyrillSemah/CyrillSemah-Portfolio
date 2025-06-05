import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["visualType", "displayType", "visualImages", "beforeImageGroup", "afterImageGroup", "imageReplacer"]

  connect() {
    this.initializeVisualTypes();
    this.setupImageReplacers();
    console.log("Project form controller connected. CSRF Token:", document.querySelector("meta[name='csrf-token']")?.getAttribute("content"));
  }
  
  setupImageReplacers() {
    // Créer un input file caché pour chaque image
    document.querySelectorAll('.btn-modify-image').forEach((button, index) => {
      const attachmentId = button.dataset.attachmentId;
      const projectId = button.dataset.projectId;
      
      // Créer un input file caché avec un ID unique
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      fileInput.classList.add('d-none', 'image-replacer-input');
      fileInput.id = `image-replacer-${attachmentId}`;
      fileInput.dataset.attachmentId = attachmentId;
      fileInput.dataset.projectId = projectId;
      
      // Ajouter l'input au DOM
      document.body.appendChild(fileInput);
      
      // Écouter les changements sur cet input
      fileInput.addEventListener('change', (event) => this.handleImageReplacement(event, attachmentId));
    });
  }

  initializeVisualTypes() {
    if (this.hasVisualTypeTarget) {
      this.visualTypeTargets.forEach(select => {
        this.toggleVisualTypeFields(select);
      });
    }
  }

  toggleVisualType(event) {
    this.toggleVisualTypeFields(event.target);
  }

  toggleVisualTypeFields(select) {
    const container = select.closest('.visual-form-container');
    if (!container) return;

    const beforeImageGroup = container.querySelector('.before-image-group');
    const afterImageGroup = container.querySelector('.after-image-group');
    
    if (!beforeImageGroup || !afterImageGroup) return;

    const visualType = select.value;
    
    if (visualType === 'before_after') {
      beforeImageGroup.style.display = 'block';
      afterImageGroup.style.display = 'block';
      beforeImageGroup.querySelector('label').textContent = 'Image avant';
      afterImageGroup.querySelector('label').textContent = 'Image après';
    } else {
      beforeImageGroup.style.display = 'none';
      afterImageGroup.style.display = 'block';
      afterImageGroup.querySelector('label').textContent = 'Image';
    }
  }

  // Méthode pour ouvrir le sélecteur de fichier lorsqu'on clique sur "Modifier"
  modifyDevelopmentImage(event) {
    console.log("Méthode modifyDevelopmentImage appelée");
    event.preventDefault();
    const button = event.currentTarget;
    const attachmentId = button.dataset.attachmentId;
    
    console.log("Bouton cliqué:", button);
    console.log("ID de l'attachement:", attachmentId);
    
    // Trouver l'input file correspondant et déclencher un clic
    const fileInput = document.getElementById(`image-replacer-${attachmentId}`);
    console.log("Input file trouvé:", fileInput);
    
    if (fileInput) {
      console.log("Déclenchement du clic sur l'input file");
      fileInput.click();
    } else {
      console.error(`Input file avec ID image-replacer-${attachmentId} non trouvé`);
      alert('Erreur technique : impossible de modifier cette image.');
    }
  }
  
  // Méthode appelée lorsqu'une nouvelle image est sélectionnée
  async handleImageReplacement(event, attachmentId) {
    const fileInput = event.target;
    const file = fileInput.files[0];
    const projectId = fileInput.dataset.projectId;
    
    if (!file) return;
    
    console.log(`Remplacement de l'image ${attachmentId} avec le fichier:`, file.name);
    
    // Trouver l'élément image à remplacer
    const imageContainer = document.getElementById(`development_attachment_${attachmentId}`);
    if (!imageContainer) {
      console.error(`Container d'image avec ID development_attachment_${attachmentId} non trouvé`);
      return;
    }
    
    const imgElement = imageContainer.querySelector('img');
    if (!imgElement) {
      console.error('Élément img non trouvé dans le container');
      return;
    }
    
    // Créer un FormData pour envoyer le fichier
    const formData = new FormData();
    formData.append('development_image', file);
    
    // Récupérer le token CSRF
    const csrfTokenMeta = document.querySelector("meta[name='csrf-token']");
    if (!csrfTokenMeta) {
      console.error('CSRF token meta tag not found');
      alert('Erreur de sécurité (CSRF token manquant). Veuillez actualiser la page.');
      return;
    }
    const csrfToken = csrfTokenMeta.getAttribute("content");
    
    try {
      // Afficher un indicateur de chargement
      imgElement.style.opacity = '0.5';
      const loadingIndicator = document.createElement('div');
      loadingIndicator.className = 'loading-indicator';
      loadingIndicator.textContent = 'Chargement...';
      imageContainer.appendChild(loadingIndicator);
      
      // Créer une URL temporaire pour prévisualiser l'image
      const tempUrl = URL.createObjectURL(file);
      imgElement.src = tempUrl;
      
      // Envoyer la requête pour remplacer l'image
      const url = `/admin/projects/${projectId}/replace_development_image/${attachmentId}`;
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'X-CSRF-Token': csrfToken,
          'Accept': 'application/json'
        },
        body: formData
      });
      
      const data = await response.json();
      
      // Supprimer l'indicateur de chargement
      if (loadingIndicator) loadingIndicator.remove();
      imgElement.style.opacity = '1';
      
      if (response.ok && data.success) {
        // Mettre à jour l'image avec l'URL fournie par le serveur si disponible
        if (data.image_url) {
          imgElement.src = data.image_url;
        }
        alert(data.message || 'Image remplacée avec succès.');
      } else {
        // Restaurer l'ancienne image
        imgElement.src = imgElement.getAttribute('data-original-src') || imgElement.src;
        console.error('Erreur lors du remplacement de l\'image:', data.message);
        alert(data.message || 'Erreur lors du remplacement de l\'image.');
      }
      
      // Libérer l'URL temporaire
      URL.revokeObjectURL(tempUrl);
      
    } catch (error) {
      console.error('Erreur lors du remplacement de l\'image:', error);
      alert('Une erreur réseau est survenue lors du remplacement de l\'image.');
      // Restaurer l'opacité normale
      imgElement.style.opacity = '1';
      // Supprimer l'indicateur de chargement s'il existe
      const loadingIndicator = imageContainer.querySelector('.loading-indicator');
      if (loadingIndicator) loadingIndicator.remove();
    }
  }
  
  async deleteDevelopmentImage(event) {
    event.preventDefault();
    const button = event.currentTarget;
    const projectId = button.dataset.projectId;
    const attachmentId = button.dataset.attachmentId;

    console.log("Attempting to delete image. Project ID:", projectId, "Attachment ID:", attachmentId);
    console.log("Button clicked:", button);

    if (!confirm("Êtes-vous sûr de vouloir supprimer cette image ?")) {
      console.log("Deletion cancelled by user.");
      return;
    }

    const url = `/admin/projects/${projectId}/delete_development_image/${attachmentId}`;
    console.log("Request URL:", url);

    const csrfTokenMeta = document.querySelector("meta[name='csrf-token']");
    if (!csrfTokenMeta) {
      console.error('CSRF token meta tag not found');
      alert('Erreur de sécurité (CSRF token manquant). Veuillez actualiser la page.');
      return;
    }
    const csrfToken = csrfTokenMeta.getAttribute("content");
    if (!csrfToken) {
      console.error('CSRF token content is empty');
      alert('Erreur de sécurité (CSRF token vide). Veuillez actualiser la page.');
      return;
    }
    console.log("CSRF Token for request:", csrfToken);

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'X-CSRF-Token': csrfToken,
          'Accept': 'application/json'
        }
      });

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok && data.success) {
        const imageItem = button.closest('.development-image-item');
        console.log("Image item to remove:", imageItem);
        if (imageItem) {
          imageItem.remove();
          console.log("Image item removed from DOM.");
        } else {
          console.error("Could not find '.development-image-item' to remove.");
        }
        alert(data.message || 'Image supprimée avec succès.');
      } else {
        console.error("Failed to delete image:", data.message);
        alert(data.message || 'Erreur lors de la suppression de l’image.');
      }
    } catch (error) {
      console.error("Error during fetch operation for deleteDevelopmentImage:", error);
      alert('Une erreur réseau est survenue lors de la tentative de suppression de l’image.');
    }
  }
}

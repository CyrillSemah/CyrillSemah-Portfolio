// Script pour gérer les images du carrousel dans le formulaire d'édition de projet
document.addEventListener('DOMContentLoaded', function() {
  // Initialisation des gestionnaires d'événements pour les boutons de modification
  initModifyButtons();
  
  // Initialisation des gestionnaires d'événements pour les boutons de suppression
  initDeleteButtons();
  
  // Initialisation des gestionnaires d'événements pour les boutons de visualisation
  initViewButtons();
});

/**
 * Affiche une notification en utilisant le système de notifications existant
 * @param {string} message - Message à afficher
 * @param {string} type - Type de notification (success, error, info, warning)
 */
function showNotification(message, type = 'info') {
  if (window.createNotification) {
    window.createNotification(message, type);
  } else {
    // Fallback si le système de notifications n'est pas disponible
    if (type === 'error') {
      console.error(message);
    } else {
      console.log(message);
    }
  }
}

/**
 * Initialise les boutons de modification d'image
 */
function initModifyButtons() {
  // Sélectionner tous les boutons "Modifier"
  const modifyButtons = document.querySelectorAll('.btn-modify-image');
  
  modifyButtons.forEach(button => {
    button.addEventListener('click', function(event) {
      event.preventDefault();
      
      const attachmentId = this.dataset.attachmentId;
      const projectId = this.dataset.projectId;
      
      console.log(`Modification demandée pour l'image ${attachmentId} du projet ${projectId}`);
      
      // Créer un input file temporaire
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      fileInput.style.display = 'none';
      document.body.appendChild(fileInput);
      
      // Déclencher le clic sur l'input file
      fileInput.click();
      
      // Gérer le changement de fichier
      fileInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
          const file = this.files[0];
          console.log(`Fichier sélectionné: ${file.name}`);
          
          // Trouver l'élément image à remplacer
          const imageContainer = document.getElementById(`development_attachment_${attachmentId}`);
          if (!imageContainer) {
            console.error(`Container d'image avec ID development_attachment_${attachmentId} non trouvé`);
            showNotification('Erreur technique : container d\'image non trouvé.', 'error');
            document.body.removeChild(fileInput); // Nettoyer l'input file
            return;
          }
          
          // Log pour déboguer
          console.log(`Modification de l'image: attachmentId=${attachmentId}, projectId=${projectId}`);
          console.log(`Container trouvé: ${imageContainer.id}`);
          
          const imgElement = imageContainer.querySelector('img');
          if (!imgElement) {
            console.error('Élément img non trouvé dans le container');
            showNotification('Erreur technique : élément image non trouvé.', 'error');
            document.body.removeChild(fileInput); // Nettoyer l'input file
            return;
          }
          
          // Afficher un indicateur de chargement
          imgElement.style.opacity = '0.5';
          const loadingIndicator = document.createElement('div');
          loadingIndicator.className = 'loading-indicator';
          loadingIndicator.textContent = 'Chargement...';
          imageContainer.appendChild(loadingIndicator);
          
          // Créer une URL temporaire pour prévisualiser l'image
          const tempUrl = URL.createObjectURL(file);
          imgElement.src = tempUrl;
          
          // Créer un FormData pour envoyer le fichier
          const formData = new FormData();
          formData.append('development_image', file);
          
          // Récupérer le token CSRF
          const csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content");
          
          // Ajouter des logs de débogage
          console.log(`Envoi de la requête de remplacement - projectId: ${projectId}, attachmentId: ${attachmentId}`);
          console.log('Taille du fichier:', file.size, 'octets');
          
          // Envoyer la requête pour remplacer l'image
          fetch(`/admin/projects/${projectId}/replace_development_image/${attachmentId}`, {
            method: 'PATCH',
            headers: {
              'X-CSRF-Token': csrfToken,
              'Accept': 'application/json'
              // Ne pas inclure Content-Type ici, il sera automatiquement défini avec boundary
            },
            body: formData
          })
          .then(response => {
            console.log('Statut de la réponse:', response.status);
            // Vérifier le statut de la réponse
            if (!response.ok) {
              throw new Error(`Erreur HTTP: ${response.status} ${response.statusText}`);
            }
            return response.json().catch(err => {
              throw new Error('Erreur de parsing JSON: ' + err.message);
            });
          })
          .then(data => {
            // Supprimer l'indicateur de chargement
            if (loadingIndicator) loadingIndicator.remove();
            imgElement.style.opacity = '1';
            
            console.log('Réponse du serveur pour le remplacement:', data);
            
            if (data.success) {
              // Vérifier à nouveau que le conteneur de l'image existe toujours
              const imageContainer = document.getElementById(`development_attachment_${attachmentId}`);
              if (imageContainer && imgElement) {
                // Mettre à jour l'image avec l'URL fournie par le serveur si disponible
                if (data.image_url) {
                  imgElement.src = data.image_url;
                  console.log(`Image mise à jour avec la nouvelle URL: ${data.image_url}`);
                }
                
                // Mettre à jour les ID d'attachement dans le DOM avec le nouvel ID d'attachement
                if (data.new_attachment_id) {
                  const newAttachmentId = data.new_attachment_id;
                  console.log(`Mise à jour de l'ID d'attachement: ancien=${attachmentId}, nouveau=${newAttachmentId}`);
                  
                  // Mettre à jour l'ID du conteneur
                  imageContainer.id = `development_attachment_${newAttachmentId}`;
                  imageContainer.setAttribute('data-attachment-id', newAttachmentId);
                  
                  // Mettre à jour les boutons
                  const viewButton = imageContainer.querySelector('.btn-view-image');
                  const modifyButton = imageContainer.querySelector('.btn-modify-image');
                  const deleteButton = imageContainer.querySelector('.btn-delete-image');
                  
                  if (viewButton) {
                    viewButton.setAttribute('data-attachment-id', newAttachmentId);
                    if (data.image_full_url) {
                      viewButton.setAttribute('data-image-url', data.image_full_url);
                    }
                  }
                  
                  if (modifyButton) {
                    modifyButton.setAttribute('data-attachment-id', newAttachmentId);
                  }
                  
                  if (deleteButton) {
                    deleteButton.setAttribute('data-attachment-id', newAttachmentId);
                  }
                } else {
                  console.warn('Nouvel ID d\'attachement non reçu du serveur');
                  
                  // Mettre à jour l'attribut data-image-url du bouton 'Voir' quand même
                  const viewButton = imageContainer.querySelector('.btn-view-image');
                  if (viewButton && data.image_full_url) {
                    viewButton.setAttribute('data-image-url', data.image_full_url);
                  }
                }
              } else {
                console.warn('Container ou image non trouvé après le remplacement');
              }
              
              // Afficher une notification de succès
              showNotification(data.message || 'Image remplacée avec succès.', 'success');
            } else {
              console.error('Erreur lors du remplacement de l\'image:', data.message);
              // Afficher une notification d'erreur
              showNotification(data.message || 'Erreur lors du remplacement de l\'image.', 'error');
            }
            
            // Libérer l'URL temporaire
            URL.revokeObjectURL(tempUrl);
          })
          .catch(error => {
            console.error('Erreur lors du remplacement de l\'image:', error.message);
            // Log détaillé pour débogage
            console.error('Détails de l\'erreur:', error);
            console.error('URL de la requête:', `/admin/projects/${projectId}/replace_development_image/${attachmentId}`);
            
            // Afficher une notification d'erreur avec plus de détails
            const errorMessage = error.message || 'Raison inconnue';
            showNotification(`Une erreur réseau est survenue lors du remplacement de l'image: ${errorMessage}`, 'error');
            
            // Restaurer l'opacité normale
            imgElement.style.opacity = '1';
            
            // Supprimer l'indicateur de chargement s'il existe
            if (loadingIndicator) loadingIndicator.remove();
            
            // Libérer l'URL temporaire
            URL.revokeObjectURL(tempUrl);
            
            // Nettoyer l'input file
            document.body.removeChild(fileInput);
          });
          
          // Supprimer l'input file temporaire après utilisation
          setTimeout(() => {
            document.body.removeChild(fileInput);
          }, 1000);
        }
      });
    });
  });
}

/**
 * Initialise les boutons de suppression d'image
 */
function initDeleteButtons() {
  // Sélectionner tous les boutons "Supprimer"
  const deleteButtons = document.querySelectorAll('.btn-delete-image');
  
  // Sélectionner la modale de confirmation existante
  const modal = document.getElementById('deleteConfirmationModal');
  const confirmButton = document.getElementById('confirmDeleteBtn');
  const warningMessage = modal ? modal.querySelector('.warning-message') : null;
  const warningDetails = modal ? modal.querySelector('.warning-details') : null;
  
  // Variables pour stocker les informations de l'image à supprimer
  let currentAttachmentId = null;
  let currentProjectId = null;
  
  // Fonction pour supprimer l'image
  function deleteImage(attachmentId, projectId) {
    // Récupérer le token CSRF
    const csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content");
    
    // Log pour déboguer
    console.log(`Suppression de l'image: attachmentId=${attachmentId}, projectId=${projectId}`);
    
    // Envoyer la requête pour supprimer l'image
    fetch(`/admin/projects/${projectId}/delete_development_image/${attachmentId}`, {
      method: 'DELETE',
      headers: {
        'X-CSRF-Token': csrfToken,
        'Accept': 'application/json'
      }
    })
    .then(response => {
      // Vérifier le status de la réponse
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      if (data.success) {
        // Trouver l'élément image à supprimer
        const imageContainer = document.getElementById(`development_attachment_${attachmentId}`);
        console.log(`Container d'image trouvé: ${imageContainer ? 'oui' : 'non'}`);
        
        if (imageContainer) {
          // Ajouter une classe pour l'animation de disparition
          imageContainer.classList.add('fade-out');
          
          // Supprimer l'élément après l'animation
          setTimeout(() => {
            imageContainer.remove();
            console.log("Image supprimée du DOM.");
          }, 500);
        } else {
          console.error(`Container d'image avec ID development_attachment_${attachmentId} non trouvé`);
        }
        // Afficher une notification de succès
        showNotification(data.message || 'Image supprimée avec succès.', 'success');
      } else {
        console.error('Erreur lors de la suppression de l\'image:', data.message);
        // Afficher une notification d'erreur
        showNotification(data.message || 'Erreur lors de la suppression de l\'image.', 'error');
      }
    })
    .catch(error => {
      console.error('Erreur lors de la suppression de l\'image:', error.message);
      // Afficher une notification d'erreur
      showNotification('Une erreur réseau est survenue lors de la suppression de l\'image.', 'error');
    });
  }
  
  // Ajouter les écouteurs d'événements aux boutons de suppression
  deleteButtons.forEach(button => {
    button.addEventListener('click', function(event) {
      event.preventDefault();
      
      // Stocker les informations de l'image à supprimer
      currentAttachmentId = this.dataset.attachmentId;
      currentProjectId = this.dataset.projectId;
      
      console.log(`Suppression demandée pour l'image ${currentAttachmentId} du projet ${currentProjectId}`);
      
      // Personnaliser le texte de la modale pour la suppression d'image
      if (warningMessage) {
        warningMessage.textContent = "Êtes-vous sûr de vouloir supprimer cette image ?";
      }
      if (warningDetails) {
        warningDetails.textContent = "Cette image sera définitivement supprimée et ne pourra pas être récupérée.";
      }
      
      // Créer un attribut temporaire pour stocker l'URL de suppression
      if (confirmButton) {
        confirmButton.setAttribute('data-temp-action', 'delete-image');
      }
      
      // Afficher la modale de confirmation existante
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Empêcher le défilement
      } else {
        // Fallback vers la confirmation standard du navigateur
        if (confirm("Êtes-vous sûr de vouloir supprimer cette image ?")) {
          deleteImage(currentAttachmentId, currentProjectId);
        }
      }
    });
  });
  
  // Étendre la fonctionnalité du bouton de confirmation existant
  if (confirmButton) {
    const originalClickHandler = confirmButton.onclick;
    
    confirmButton.addEventListener('click', function() {
      // Vérifier si c'est une action de suppression d'image
      if (this.getAttribute('data-temp-action') === 'delete-image') {
        // Supprimer l'image avec notre fonction personnalisée
        if (currentAttachmentId && currentProjectId) {
          deleteImage(currentAttachmentId, currentProjectId);
        }
        
        // Nettoyer l'attribut temporaire
        this.removeAttribute('data-temp-action');
        
        // Fermer la modale
        if (modal) {
          modal.classList.remove('active');
          document.body.style.overflow = ''; // Réactiver le défilement
        }
        
        // Empêcher l'exécution du gestionnaire d'événements d'origine
        return false;
      }
    }, true); // Utiliser la capture pour s'exécuter avant le gestionnaire d'origine
  }
}

/**
 * Initialise les boutons de visualisation d'image
 */
function initViewButtons() {
  console.log('Initialisation des boutons de visualisation d\'images');
  
  // Sélectionner tous les boutons "Voir"
  const viewButtons = document.querySelectorAll('.btn-view-image');
  console.log(`${viewButtons.length} boutons de visualisation trouvés`);
  
  // Sélectionner la modale et son contenu
  const modal = document.getElementById('imagePreviewModal');
  const previewImage = document.getElementById('previewImage');
  const closeButtons = modal ? modal.querySelectorAll('.modal-close, .close-modal') : [];
  
  if (!modal) {
    console.error('Modale imagePreviewModal non trouvée dans le DOM');
    return;
  }
  
  if (!previewImage) {
    console.error('Élément previewImage non trouvé dans le DOM');
    return;
  }
  
  console.log('Éléments DOM de modale trouvés');
  
  // Fonction pour ouvrir la modale
  function openModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Empêcher le défilement
  }
  
  // Fonction pour fermer la modale
  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Réactiver le défilement
  }
  
  // Ajouter les écouteurs d'événements aux boutons de visualisation
  viewButtons.forEach(button => {
    button.addEventListener('click', function(event) {
      event.preventDefault();
      console.log('Clic sur le bouton Voir');
      
      // Récupérer l'URL de l'image
      const imageUrl = this.dataset.imageUrl;
      console.log('URL de l\'image:', imageUrl);
      
      if (imageUrl) {
        // Définir la source de l'image dans la modale
        previewImage.src = imageUrl;
        
        // Attendre que l'image soit chargée pour afficher la modale
        previewImage.onload = function() {
          openModal();
        };
        
        // En cas d'erreur, afficher quand même la modale
        previewImage.onerror = function() {
          console.error('Erreur de chargement de l\'image');
          showNotification('L\'image n\'a pas pu être chargée', 'error');
          openModal();
        };
      } else {
        console.error('URL d\'image non définie');
        showNotification('Impossible d\'afficher l\'image : URL non définie', 'error');
      }
    });
  });
  
  // Ajouter un gestionnaire pour les boutons de fermeture de la modale
  closeButtons.forEach(button => {
    button.addEventListener('click', closeModal);
  });
  
  // Fermer la modale en cliquant sur l'arrière-plan (comme pour les autres modales)
  modal.addEventListener('click', function(event) {
    if (event.target === modal) {
      closeModal();
    }
  });
  
  // Fermer la modale avec la touche Échap
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

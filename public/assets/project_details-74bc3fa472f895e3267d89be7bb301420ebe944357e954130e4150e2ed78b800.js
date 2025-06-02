// Script pour gérer l'affichage des détails d'un projet
document.addEventListener('DOMContentLoaded', () => {
  console.info('Script de détails des projets chargé');
  
  // Sélectionner tous les boutons "Voir détails"
  const projectDetailButtons = document.querySelectorAll('.js-project-details');
  
  // Créer une modale pour les détails du projet
  let projectModal = document.querySelector('.project-detail-modal');
  
  // Si la modale n'existe pas, la créer
  if (!projectModal) {
    projectModal = document.createElement('div');
    projectModal.className = 'project-detail-modal';
    projectModal.innerHTML = `
      <div class="project-detail-modal__overlay"></div>
      <div class="project-detail-modal__content">
        <button class="project-detail-modal__close">
          <i class="fas fa-times"></i>
        </button>
        <div class="project-detail-modal__body">
          <div class="loading">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Chargement des détails du projet...</p>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(projectModal);
    
    // Ajouter les styles pour la modale
    const modalStyles = document.createElement('style');
    modalStyles.textContent = `
      .project-detail-modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1000;
      }
      
      .project-detail-modal.active {
        display: block;
      }
      
      .project-detail-modal__overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      
      .project-detail-modal.active .project-detail-modal__overlay {
        opacity: 1;
      }
      
      .project-detail-modal__content {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0.9);
        width: 90%;
        max-width: 800px;
        max-height: 90vh;
        background-color: white;
        border-radius: 12px;
        padding: 30px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        opacity: 0;
        transition: all 0.3s ease;
        overflow-y: auto;
      }
      
      .project-detail-modal.active .project-detail-modal__content {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
      }
      
      .project-detail-modal__close {
        position: absolute;
        top: 15px;
        right: 15px;
        width: 30px;
        height: 30px;
        border: none;
        background: none;
        cursor: pointer;
        font-size: 1.5rem;
        color: #6c757d;
        transition: color 0.3s ease;
        z-index: 1;
      }
      
      .project-detail-modal__close:hover {
        color: #202f66;
      }
      
      .project-detail-modal__body {
        position: relative;
      }
      
      .project-detail-modal .loading {
        text-align: center;
        padding: 30px;
      }
      
      .project-detail-modal .loading i {
        font-size: 2rem;
        color: #2b3f8a;
        margin-bottom: 15px;
      }
      
      .project-detail {
        padding: 20px 0;
      }
      
      .project-detail__header {
        margin-bottom: 20px;
      }
      
      .project-detail__title {
        font-size: 1.8rem;
        color: #202f66;
        margin-bottom: 10px;
      }
      
      .project-detail__technologies {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
        margin-bottom: 20px;
      }
      
      .project-detail__technologies .technology-tag {
        background-color: rgba(43, 63, 138, 0.1);
        color: #2b3f8a;
        padding: 3px 8px;
        border-radius: 4px;
        font-size: 0.8rem;
      }
      
      .project-detail__image {
        margin-bottom: 20px;
        border-radius: 8px;
        overflow: hidden;
      }
      
      .project-detail__image img {
        width: 100%;
        height: auto;
        display: block;
      }
      
      .project-detail__description {
        line-height: 1.6;
        color: #6c757d;
        margin-bottom: 20px;
      }
      
      .project-detail__actions {
        display: flex;
        gap: 10px;
      }
      
      .project-detail__actions .btn {
        padding: 8px 16px;
        border-radius: 8px;
        text-decoration: none;
        font-weight: 500;
        transition: all 0.3s ease;
        display: inline-flex;
        align-items: center;
      }
      
      .project-detail__actions .btn i {
        margin-right: 5px;
      }
      
      .project-detail__actions .btn-primary {
        background-color: #2b3f8a;
        color: white;
      }
      
      .project-detail__actions .btn-primary:hover {
        background-color: #202f66;
      }
    `;
    document.head.appendChild(modalStyles);
    
    // Ajouter un gestionnaire d'événements pour fermer la modale
    const closeButton = projectModal.querySelector('.project-detail-modal__close');
    const overlay = projectModal.querySelector('.project-detail-modal__overlay');
    
    closeButton.addEventListener('click', () => {
      closeProjectModal();
    });
    
    overlay.addEventListener('click', () => {
      closeProjectModal();
    });
    
    // Ajouter un gestionnaire d'événements pour la touche Echap
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && projectModal.classList.contains('active')) {
        closeProjectModal();
      }
    });
  }
  
  // Fonction pour ouvrir la modale de détails du projet
  const openProjectModal = (projectId) => {
    // Afficher la modale
    projectModal.classList.add('active');
    document.body.classList.add('no-scroll');
    
    // Afficher le chargement
    const modalBody = projectModal.querySelector('.project-detail-modal__body');
    modalBody.innerHTML = `
      <div class="loading">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Chargement des détails du projet...</p>
      </div>
    `;
    
    // Simuler le chargement des détails du projet (puisque nous n'avons pas d'API)
    setTimeout(() => {
      // Trouver le projet dans le DOM
      const projectCard = document.querySelector(`.project-card[data-project-id="${projectId}"]`);
      
      if (projectCard) {
        // Extraire les informations du projet
        const title = projectCard.querySelector('.project-card__title').textContent;
        const description = projectCard.getAttribute('data-description') || 'Aucune description disponible.';
        const technologies = Array.from(projectCard.querySelectorAll('.technology-tag')).map(tag => tag.textContent);
        const imageUrl = projectCard.querySelector('.project-card__image img')?.src || '';
        const projectUrl = projectCard.querySelector('.btn-secondary')?.href || '';
        
        // Créer le contenu de la modale
        modalBody.innerHTML = `
          <div class="project-detail">
            <div class="project-detail__header">
              <h2 class="project-detail__title">${title}</h2>
              <div class="project-detail__technologies">
                ${technologies.map(tech => `<span class="technology-tag">${tech}</span>`).join('')}
              </div>
            </div>
            ${imageUrl ? `
              <div class="project-detail__image">
                <img src="${imageUrl}" alt="${title}">
              </div>
            ` : ''}
            <div class="project-detail__description">
              ${description}
            </div>
            ${projectUrl ? `
              <div class="project-detail__actions">
                <a href="${projectUrl}" target="_blank" class="btn btn-primary">
                  <i class="fas fa-external-link-alt"></i> Visiter le projet
                </a>
              </div>
            ` : ''}
          </div>
        `;
      } else {
        // Afficher un message d'erreur
        modalBody.innerHTML = `
          <div class="error-message">
            <p>Impossible de charger les détails du projet.</p>
          </div>
        `;
      }
    }, 500);
  };
  
  // Fonction pour fermer la modale de détails du projet
  const closeProjectModal = () => {
    projectModal.classList.remove('active');
    document.body.classList.remove('no-scroll');
  };
  
  // Ajouter des gestionnaires d'événements pour les boutons "Voir détails"
  projectDetailButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      const projectId = button.getAttribute('data-project-id');
      if (projectId) {
        openProjectModal(projectId);
      }
    });
  });
});

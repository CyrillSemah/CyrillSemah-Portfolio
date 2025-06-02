// Script de gestion directe des cartes de compétences
document.addEventListener('DOMContentLoaded', function() {
  // DOMContentLoaded - initialisation directe des cartes
  initializeSkillCardsDirectly();
});

document.addEventListener('turbo:load', function() {
  // turbo:load - initialisation directe des cartes
  initializeSkillCardsDirectly();
});

// Exécuter immédiatement
// Exécution immédiate - initialisation directe des cartes
setTimeout(initializeSkillCardsDirectly, 0);

function initializeSkillCardsDirectly() {
  // Initialisation directe des cartes de compétences...
  
  // Sélectionner toutes les cartes
  const cards = document.querySelectorAll('.skill-item');
  // Nombre de cartes trouvées
  
  if (cards.length === 0) {
    // Aucune carte trouvée, réessai dans 500ms
    setTimeout(initializeSkillCardsDirectly, 500);
    return;
  }
  
  // Variable pour suivre la carte active
  let activeCard = null;
  
  // Créer l'overlay pour l'arrière-plan sombre
  const overlay = document.createElement('div');
  overlay.className = 'skill-overlay';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  overlay.style.zIndex = '90';
  overlay.style.display = 'none';
  document.body.appendChild(overlay);
  
  // Ajouter le comportement de clic à chaque carte
  cards.forEach((card, index) => {
    // Configuration de la carte
    
    // Effet au survol
    card.addEventListener('mouseenter', function() {
      if (!activeCard) {
        this.style.transform = 'translateY(-10px) scale(1.05)';
        this.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.2)';
        this.style.zIndex = '10';
      }
    });
    
    card.addEventListener('mouseleave', function() {
      if (!activeCard || activeCard !== this) {
        this.style.transform = '';
        this.style.boxShadow = '';
        this.style.zIndex = '';
      }
    });
    
    // Gestion du clic
    card.addEventListener('click', function(e) {
      // Clic sur la carte
      e.preventDefault();
      e.stopPropagation();
      
      // Si cette carte est déjà active, la fermer
      if (activeCard === this) {
        // Fermeture de la carte active
        closeCard(this);
        return;
      }
      
      // Si une autre carte est active, la fermer
      if (activeCard) {
        // Fermeture de la carte précédente
        closeCard(activeCard);
      }
      
      // Ouvrir cette carte
      // Ouverture de la carte
      openCard(this);
    });
    
    // Construire ou récupérer les éléments de la carte
    const frontFace = card.querySelector('.skill-item__front') || createFrontFace(card);
    const backFace = card.querySelector('.skill-item__back') || createBackFace(card);
    
    // S'assurer que seule la face avant est visible au départ
    frontFace.style.display = 'flex';
    backFace.style.display = 'none';
  });
  
  // Fermer la carte active en cliquant sur l'overlay
  overlay.addEventListener('click', function() {
    if (activeCard) {
      // Clic sur overlay - fermeture de la carte active
      closeCard(activeCard);
    }
  });
  
  // Fonction pour ouvrir une carte
  function openCard(card) {
    // Récupérer le groupe parent
    const skillsGroup = card.closest('.skills-group__items');
    if (!skillsGroup) return;
    
    // Stocker la position originale
    card.dataset.originalPosition = card.style.position || '';
    card.dataset.originalWidth = card.style.width || '';
    card.dataset.originalHeight = card.style.height || '';
    
    // Assurer que le parent a une position relative pour le positionnement absolu
    skillsGroup.style.position = 'relative';
    
    // Positionner la carte au centre
    card.style.position = 'absolute';
    card.style.left = '50%';
    card.style.top = '50%';
    card.style.transform = 'translate(-50%, -50%)';
    card.style.width = '80%';
    card.style.maxWidth = '500px';
    card.style.height = 'auto';
    card.style.minHeight = '300px';
    card.style.zIndex = '100';
    card.style.backgroundColor = 'white';
    card.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.3)';
    card.style.borderRadius = '8px';
    
    // Afficher le dos de la carte
    const frontFace = card.querySelector('.skill-item__front');
    const backFace = card.querySelector('.skill-item__back');
    
    if (frontFace) frontFace.style.display = 'none';
    if (backFace) backFace.style.display = 'block';
    
    // Afficher l'overlay
    overlay.style.display = 'block';
    setTimeout(() => {
      overlay.style.opacity = '1';
    }, 10);
    
    // Mettre à jour la référence à la carte active
    activeCard = card;
  }
  
  // Fonction pour fermer une carte
  function closeCard(card) {
    // Réinitialiser les styles
    card.style.position = card.dataset.originalPosition || '';
    card.style.width = card.dataset.originalWidth || '';
    card.style.height = card.dataset.originalHeight || '';
    card.style.left = '';
    card.style.top = '';
    card.style.transform = '';
    card.style.maxWidth = '';
    card.style.minHeight = '';
    card.style.zIndex = '';
    card.style.backgroundColor = '';
    card.style.boxShadow = '';
    
    // Afficher la face avant de la carte
    const frontFace = card.querySelector('.skill-item__front');
    const backFace = card.querySelector('.skill-item__back');
    
    if (frontFace) frontFace.style.display = 'flex';
    if (backFace) backFace.style.display = 'none';
    
    // Masquer l'overlay
    overlay.style.opacity = '0';
    setTimeout(() => {
      overlay.style.display = 'none';
    }, 300);
    
    // Réinitialiser la référence à la carte active
    activeCard = null;
  }
  
  // Fonction pour créer la face avant d'une carte si elle n'existe pas
  function createFrontFace(card) {
    if (card.querySelector('.skill-item__front')) {
      return card.querySelector('.skill-item__front');
    }
    
    const frontFace = document.createElement('div');
    frontFace.className = 'skill-item__front';
    frontFace.style.display = 'flex';
    frontFace.style.flexDirection = 'column';
    frontFace.style.alignItems = 'center';
    frontFace.style.justifyContent = 'center';
    frontFace.style.padding = '15px';
    frontFace.style.width = '100%';
    frontFace.style.height = '100%';
    
    // Essayer de récupérer le contenu existant
    const logo = card.querySelector('.skill-logo');
    const name = card.querySelector('.skill-name');
    const experience = card.querySelector('.skill-experience');
    
    if (logo) frontFace.appendChild(logo.cloneNode(true));
    if (name) frontFace.appendChild(name.cloneNode(true));
    if (experience) frontFace.appendChild(experience.cloneNode(true));
    
    card.appendChild(frontFace);
    return frontFace;
  }
  
  // Fonction pour créer la face arrière d'une carte si elle n'existe pas
  function createBackFace(card) {
    if (card.querySelector('.skill-item__back')) {
      return card.querySelector('.skill-item__back');
    }
    
    const backFace = document.createElement('div');
    backFace.className = 'skill-item__back';
    backFace.style.display = 'none';
    backFace.style.padding = '15px';
    backFace.style.width = '100%';
    backFace.style.height = '100%';
    backFace.style.overflow = 'auto';
    
    // Structure de la face arrière
    const headerDiv = document.createElement('div');
    headerDiv.className = 'skill-item__header';
    headerDiv.style.display = 'flex';
    headerDiv.style.alignItems = 'center';
    headerDiv.style.marginBottom = '15px';
    
    // Essayer de récupérer le contenu existant
    const logo = card.querySelector('.skill-logo');
    const name = card.querySelector('.skill-name');
    const description = card.querySelector('.skill-description');
    const experience = card.querySelector('.skill-experience');
    
    if (logo) headerDiv.appendChild(logo.cloneNode(true));
    if (name) headerDiv.appendChild(name.cloneNode(true));
    backFace.appendChild(headerDiv);
    
    if (description) backFace.appendChild(description.cloneNode(true));
    if (experience) backFace.appendChild(experience.cloneNode(true));
    
    card.appendChild(backFace);
    return backFace;
  }
  
  // Initialisation directe des cartes terminée
};

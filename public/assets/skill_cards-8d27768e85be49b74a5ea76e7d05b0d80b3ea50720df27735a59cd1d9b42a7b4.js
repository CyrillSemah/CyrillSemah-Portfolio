// Animation des cartes de compétences
document.addEventListener('turbo:load', function() {
  // turbo:load fired
  initializeSkillCards();
});

document.addEventListener('DOMContentLoaded', function() {
  // DOMContentLoaded fired
  initializeSkillCards();
});

// Exécuter immédiatement pour être sûr
initializeSkillCards();

function initializeSkillCards() {
  // Initialisation des cartes de compétences...
  // Sélectionner toutes les cartes de compétences
  const skillCards = document.querySelectorAll('.skill-item');
  // Cartes de compétences trouvées
  
  // Variable pour suivre la carte active
  let activeCard = null;
  let overlay = null;
  
  // Créer l'overlay pour l'arrière-plan sombre quand une carte est agrandie
  function createOverlay() {
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'skill-overlay';
      overlay.style.position = 'fixed';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
      overlay.style.zIndex = '90';
      overlay.style.opacity = '0';
      overlay.style.transition = 'opacity 0.3s ease';
      overlay.style.pointerEvents = 'none';
      document.body.appendChild(overlay);
    }
    return overlay;
  }
  
  // Afficher l'overlay avec animation
  function showOverlay() {
    const overlay = createOverlay();
    overlay.style.opacity = '1';
    overlay.style.pointerEvents = 'auto';
  }
  
  // Masquer l'overlay avec animation
  function hideOverlay() {
    if (overlay) {
      overlay.style.opacity = '0';
      overlay.style.pointerEvents = 'none';
    }
  }
  
  // Gestion du positionnement des cartes agrandies
  function positionExpandedCard(card) {
    // Récupérer le groupe parent de compétences
    const skillsGroup = card.closest('.skills-group__items');
    
    if (skillsGroup) {
      // Appliquer directement les styles pour centrer la carte dans le groupe
      card.style.position = 'absolute';
      card.style.left = '50%';
      card.style.top = '50%';
      card.style.transform = 'translate(-50%, -50%)';
      card.style.width = '80%';
      card.style.maxWidth = '500px';
      card.style.minHeight = '350px';
      card.style.height = 'auto';
      card.style.zIndex = '100';
      
      // Référence au container de la carte
      const cardInner = card.querySelector('.skill-item__inner');
      if (cardInner) {
        cardInner.style.transform = 'rotateY(180deg)';
        cardInner.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.2)';
      }
      
      // Assurer que le conteneur parent a une position relative
      skillsGroup.style.position = 'relative';
    }
  }
  
  // Réinitialiser la position de la carte
  function resetCardPosition(card) {
    card.style.position = '';
    card.style.left = '';
    card.style.top = '';
    card.style.transform = '';
    card.style.width = '';
    card.style.maxWidth = '';
    card.style.minHeight = '';
    card.style.height = '';
    card.style.zIndex = '';
    
    const cardInner = card.querySelector('.skill-item__inner');
    if (cardInner) {
      cardInner.style.transform = '';
      cardInner.style.boxShadow = '';
    }
  }
  
  // Ajouter les écouteurs d'événements à chaque carte
  skillCards.forEach((card, index) => {
    // Ajout des écouteurs à la carte
    // Récupérer la rotation aléatoire
    const randomRotation = card.getAttribute('data-rotation') || 0;
    
    // Gestion de l'effet 3D au survol
    card.addEventListener('mousemove', function(e) {
      if (!card.classList.contains('expanded')) {
        handleMouseMove(e, card, randomRotation);
      }
    });
    
    // Réinitialiser l'effet 3D quand la souris quitte la carte
    card.addEventListener('mouseleave', function() {
      if (!card.classList.contains('expanded')) {
        resetCardTransform(card);
      }
    });
    
    // Gestion du clic pour agrandir/réduire la carte
    card.addEventListener('click', function(e) {
      // Clic sur la carte
      e.preventDefault();
      e.stopPropagation();
      
      // Si cette carte est déjà active, la fermer
      if (card.classList.contains('expanded')) {
        // Fermeture de la carte active
        card.classList.remove('expanded');
        resetCardPosition(card);
        activeCard = null;
        hideOverlay();
        return;
      }
      
      // Si une autre carte est active, la fermer
      if (activeCard && activeCard !== card) {
        // Fermeture de la carte active précédente
        activeCard.classList.remove('expanded');
        resetCardPosition(activeCard);
      }
      
      // Activer cette carte
      // Agrandissement de la carte
      card.classList.add('expanded');
      positionExpandedCard(card);
      activeCard = card;
      showOverlay();
      
      // Forcer l'affichage des faces
      const frontFace = card.querySelector('.skill-item__front');
      const backFace = card.querySelector('.skill-item__back');
      
      if (frontFace) frontFace.style.display = 'none';
      if (backFace) backFace.style.display = 'block';
    });
  });
  
  // Fermer la carte active en cliquant sur l'overlay
  document.addEventListener('click', function(e) {
    if (activeCard && !e.target.closest('.skill-item') && !e.target.closest('.skill-item__back')) {
      // Clic en dehors - fermeture de la carte active
      activeCard.classList.remove('expanded');
      resetCardPosition(activeCard);
      activeCard = null;
      hideOverlay();
    }
  });
  
  // Initialisation des cartes de compétences terminée
}

// Fonction pour gérer l'effet 3D au survol
function handleMouseMove(e, card, baseRotation) {
  const cardRect = card.getBoundingClientRect();
  const cardInner = card.querySelector('.skill-item__inner');
  
  // Calculer la position relative de la souris sur la carte (de -1 à 1)
  const x = ((e.clientX - cardRect.left) / cardRect.width) * 2 - 1;
  const y = ((e.clientY - cardRect.top) / cardRect.height) * 2 - 1;
  
  // Limiter l'angle de rotation
  const maxRotation = 8;
  const rotateY = x * maxRotation;
  const rotateX = -y * maxRotation; // Inversion pour un effet naturel
  
  // Appliquer la rotation 3D en fonction de la position de la souris
  cardInner.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg) rotateZ(${baseRotation}deg)`;
  
  // Effet de parallaxe sur le contenu
  const frontContent = card.querySelector('.skill-logo');
  if (frontContent) {
    frontContent.style.transform = `translateX(${x * 10}px) translateY(${y * 10}px)`;
  }
  
  // Effet d'ombre dynamique
  const shadowX = x * 10;
  const shadowY = y * 10;
  const shadowBlur = 20 + Math.abs(x * y) * 10;
  cardInner.style.boxShadow = `${shadowX}px ${shadowY}px ${shadowBlur}px rgba(0, 0, 0, 0.2)`;
}

// Fonction pour réinitialiser la transformation de la carte
function resetCardTransform(card) {
  const cardInner = card.querySelector('.skill-item__inner');
  const baseRotation = card.getAttribute('data-rotation') || 0;
  
  // Réinitialiser la rotation mais conserver la rotation de base
  cardInner.style.transform = `rotateZ(${baseRotation}deg)`;
  cardInner.style.boxShadow = '';
  
  // Réinitialiser la position du contenu
  const frontContent = card.querySelector('.skill-logo');
  if (frontContent) {
    frontContent.style.transform = '';
  }
};

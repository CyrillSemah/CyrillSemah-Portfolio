// Animation 3D pour la section home
let home3DInitialized = false;

document.addEventListener('DOMContentLoaded', function() {
  // Attendre un court instant pour s'assurer que le DOM est complètement chargé
  setTimeout(initializeHome3DEffect, 100);
});

function initializeHome3DEffect() {
  // Éviter les initialisations multiples
  if (home3DInitialized) {
    return;
  }
  
  // Sélectionner le conteneur animé
  const animatedContainer = document.querySelector('.animated-container');
  
  if (!animatedContainer) {
    // Ne pas afficher de message d'erreur, simplement retourner
    return;
  }
  
  // Marquer comme initialisé
  home3DInitialized = true;
  
  // Ajouter la classe pour indiquer que l'initialisation est terminée
  animatedContainer.classList.add('setup-done');
  
  // Récupérer les éléments internes pour l'effet de parallaxe
  const title = animatedContainer.querySelector('.animated-title');
  const text = animatedContainer.querySelector('.animated-text');
  const buttons = animatedContainer.querySelector('.animated-buttons');
  const bracketTopLeft = animatedContainer.querySelector('.bracket-top-left');
  const bracketTopRight = animatedContainer.querySelector('.bracket-top-right');
  const bracketBottomLeft = animatedContainer.querySelector('.bracket-bottom-left');
  const bracketBottomRight = animatedContainer.querySelector('.bracket-bottom-right');
  
  // Gestion de l'effet 3D au survol
  animatedContainer.addEventListener('mousemove', function(e) {
    handleMouseMove(e, animatedContainer, title, text, buttons, bracketTopLeft, bracketTopRight, bracketBottomLeft, bracketBottomRight);
  });
  
  // Réinitialiser l'effet 3D quand la souris quitte le conteneur
  animatedContainer.addEventListener('mouseleave', function() {
    resetContainerTransform(animatedContainer, title, text, buttons, bracketTopLeft, bracketTopRight, bracketBottomLeft, bracketBottomRight);
  });
  
  // Initialisation des effets 3D pour la section home terminée
}

// Fonction pour gérer l'effet 3D au survol
function handleMouseMove(e, container, title, text, buttons, bracketTopLeft, bracketTopRight, bracketBottomLeft, bracketBottomRight) {
  const containerRect = container.getBoundingClientRect();
  
  // Calculer la position relative de la souris sur le conteneur (de -1 à 1)
  const x = ((e.clientX - containerRect.left) / containerRect.width) * 2 - 1;
  const y = ((e.clientY - containerRect.top) / containerRect.height) * 2 - 1;
  
  // Limiter l'angle de rotation
  const maxRotation = 10;
  const rotateY = x * maxRotation;
  const rotateX = -y * maxRotation; // Inversion pour un effet naturel
  
  // Ne pas appliquer de transformation au conteneur lui-même
  container.style.transform = '';
  container.style.boxShadow = '';
  
  // Effet de parallaxe sur le titre avec ombre dynamique
  if (title) {
    title.style.transform = `perspective(1000px) rotateY(${rotateY * 0.8}deg) rotateX(${rotateX * 0.8}deg) translateZ(30px) translateX(${x * 15}px) translateY(${y * 10}px)`;
    title.style.textShadow = `
      ${-x * 5}px ${-y * 5}px 8px rgba(0, 0, 0, 0.3),
      ${x * 3}px ${y * 3}px 4px rgba(0, 0, 0, 0.2)
    `;
  }
  
  // Effet sur le texte avec ombre dynamique
  if (text) {
    text.style.transform = `perspective(1000px) rotateY(${rotateY * 0.6}deg) rotateX(${rotateX * 0.6}deg) translateZ(20px) translateX(${x * 10}px) translateY(${y * 5}px)`;
    text.style.textShadow = `
      ${-x * 3}px ${-y * 3}px 5px rgba(0, 0, 0, 0.25),
      ${x * 2}px ${y * 2}px 3px rgba(0, 0, 0, 0.15)
    `;
  }
  
  // Effet sur les boutons avec ombre dynamique
  if (buttons) {
    buttons.style.transform = `perspective(1000px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) translateZ(40px) translateX(${x * 20}px) translateY(${y * 15}px)`;
    
    // Appliquer l'effet d'ombre à chaque bouton
    const btns = buttons.querySelectorAll('.btn');
    btns.forEach(btn => {
      btn.style.boxShadow = `
        ${-x * 8}px ${-y * 8}px 12px rgba(0, 0, 0, 0.3),
        ${x * 5}px ${y * 5}px 8px rgba(0, 0, 0, 0.2)
      `;
    });
  }
  
  // Effet sur les crochets avec ombre dynamique
  if (bracketTopLeft) {
    bracketTopLeft.style.transform = `perspective(1000px) rotateY(${-rotateY * 1.2}deg) rotateX(${-rotateX * 1.2}deg) translateZ(50px) translateX(${-x * 25}px) translateY(${-y * 25}px) rotate(${-x * 5}deg)`;
    bracketTopLeft.style.filter = `drop-shadow(${-x * 12}px ${-y * 12}px 15px rgba(0, 0, 0, 0.3))`;
  }
  
  // Crochet invisible en haut à droite
  if (bracketTopRight) {
    bracketTopRight.style.transform = `perspective(1000px) rotateY(${rotateY * 1.2}deg) rotateX(${-rotateX * 1.2}deg) translateZ(50px) translateX(${x * 25}px) translateY(${-y * 25}px) rotate(${x * 5}deg)`;
    // Pas d'ombre pour les crochets invisibles
  }
  
  // Crochet invisible en bas à gauche
  if (bracketBottomLeft) {
    bracketBottomLeft.style.transform = `perspective(1000px) rotateY(${-rotateY * 1.2}deg) rotateX(${rotateX * 1.2}deg) translateZ(50px) translateX(${-x * 25}px) translateY(${y * 25}px) rotate(${-x * 5}deg)`;
    // Pas d'ombre pour les crochets invisibles
  }
  
  if (bracketBottomRight) {
    bracketBottomRight.style.transform = `perspective(1000px) rotateY(${rotateY * 1.2}deg) rotateX(${rotateX * 1.2}deg) translateZ(60px) translateX(${x * 25}px) translateY(${y * 25}px) rotate(${x * 5}deg)`;
    bracketBottomRight.style.filter = `drop-shadow(${x * 12}px ${y * 12}px 15px rgba(0, 0, 0, 0.3))`;
  }
}

// Fonction pour réinitialiser la transformation du conteneur
function resetContainerTransform(container, title, text, buttons, bracketTopLeft, bracketTopRight, bracketBottomLeft, bracketBottomRight) {
  // Réinitialiser la transformation du conteneur
  container.style.transform = '';
  container.style.boxShadow = '';
  
  // Réinitialiser les éléments internes avec leurs ombres
  if (title) {
    title.style.transform = '';
    title.style.textShadow = '';
  }
  
  if (text) {
    text.style.transform = '';
    text.style.textShadow = '';
  }
  
  if (buttons) {
    buttons.style.transform = '';
    // Réinitialiser les ombres de chaque bouton
    const btns = buttons.querySelectorAll('.btn');
    btns.forEach(btn => {
      btn.style.boxShadow = '';
    });
  }
  
  // Réinitialiser les crochets
  if (bracketTopLeft) {
    bracketTopLeft.style.transform = 'rotate(0deg)';
    bracketTopLeft.style.filter = '';
  }
  
  if (bracketTopRight) {
    bracketTopRight.style.transform = 'rotate(0deg)';
  }
  
  if (bracketBottomLeft) {
    bracketBottomLeft.style.transform = 'rotate(0deg)';
  }
  
  if (bracketBottomRight) {
    bracketBottomRight.style.transform = 'rotate(0deg)';
    bracketBottomRight.style.filter = '';
  }
}

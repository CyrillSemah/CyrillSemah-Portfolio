// Animation 3D pour l'image de profil
document.addEventListener('turbo:load', function() {
  console.log('turbo:load fired - initialisation des effets 3D pour l\'image de profil');
  initializeImage3DEffect();
});

document.addEventListener('DOMContentLoaded', function() {
  console.log('DOMContentLoaded fired - initialisation des effets 3D pour l\'image de profil');
  initializeImage3DEffect();
});

// Exécuter immédiatement pour être sûr
initializeImage3DEffect();

function initializeImage3DEffect() {
  console.log('Initialisation des effets 3D pour l\'image de profil...');
  
  // Sélectionner le conteneur de l'image
  const imageContainer = document.querySelector('.section-home__image .image-container');
  
  if (!imageContainer) {
    console.log('Le conteneur de l\'image n\'a pas été trouvé');
    return;
  }
  
  console.log('Conteneur de l\'image trouvé, ajout des écouteurs d\'événements');
  
  // Ajouter la classe pour indiquer que l'initialisation est terminée
  imageContainer.classList.add('setup-done');
  
  // Récupérer les éléments internes pour l'effet de parallaxe
  const image = imageContainer.querySelector('img');
  const depthLayer = imageContainer.querySelector('.depth-layer');
  const borderLayer = imageContainer.querySelector('.border-layer');
  const gridLayer = imageContainer.querySelector('.grid-layer');
  const highlightLayer = imageContainer.querySelector('.highlight-layer');
  const particles = imageContainer.querySelectorAll('.particle');
  
  // Gestion de l'effet 3D au survol
  imageContainer.addEventListener('mousemove', function(e) {
    handleImageMouseMove(e, imageContainer, image, depthLayer, borderLayer, gridLayer, highlightLayer, particles);
  });
  
  // Réinitialiser l'effet 3D quand la souris quitte le conteneur
  imageContainer.addEventListener('mouseleave', function() {
    resetImageTransform(imageContainer, image, depthLayer, borderLayer, gridLayer, highlightLayer, particles);
  });
  
  console.log('Initialisation des effets 3D pour l\'image de profil terminée');
}

// Fonction pour gérer l'effet 3D au survol
function handleImageMouseMove(e, container, image, depthLayer, borderLayer, gridLayer, highlightLayer, particles) {
  const containerRect = container.getBoundingClientRect();
  
  // Calculer la position relative de la souris sur le conteneur (de -1 à 1)
  const x = ((e.clientX - containerRect.left) / containerRect.width) * 2 - 1;
  const y = ((e.clientY - containerRect.top) / containerRect.height) * 2 - 1;
  
  // Limiter l'angle de rotation
  const maxRotation = 15;
  const rotateY = x * maxRotation;
  const rotateX = -y * maxRotation; // Inversion pour un effet naturel
  
  // Appliquer la rotation 3D au conteneur principal
  container.style.transform = `perspective(1000px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
  
  // Effet de parallaxe sur l'image principale
  if (image) {
    image.style.transform = `translateZ(30px) translateX(${x * 15}px) translateY(${y * 15}px)`;
    // Ajuster le filtre en fonction de la position
    image.style.filter = `contrast(${1.1 + Math.abs(x) * 0.1}) saturate(${1.2 + Math.abs(y) * 0.1})`;
  }
  
  // Effet sur la couche de profondeur
  if (depthLayer) {
    depthLayer.style.transform = `translateZ(-20px) translateX(${-x * 10}px) translateY(${-y * 10}px)`;
    depthLayer.style.boxShadow = `${x * 15}px ${y * 15}px 30px rgba(43, 63, 138, 0.5)`;
  }
  
  // Effet sur la bordure
  if (borderLayer) {
    borderLayer.style.transform = `translateZ(10px) translateX(${x * 5}px) translateY(${y * 5}px)`;
  }
  
  // Effet sur la grille
  if (gridLayer) {
    gridLayer.style.transform = `translateZ(5px) translateX(${x * 8}px) translateY(${y * 8}px)`;
    gridLayer.style.backgroundPosition = `${x * 10}px ${y * 10}px`;
  }
  
  // Effet sur la couche de surbrillance
  if (highlightLayer) {
    highlightLayer.style.transform = `translateZ(15px) translateX(${x * 12}px) translateY(${y * 12}px)`;
    highlightLayer.style.background = `linear-gradient(${135 + x * 30}deg, rgba(255, 255, 255, ${0.2 + Math.abs(x) * 0.1}) 0%, transparent 50%, rgba(176, 193, 51, ${0.1 + Math.abs(y) * 0.1}) 100%)`;
  }
  
  // Effet sur les particules
  if (particles && particles.length) {
    particles.forEach((particle, index) => {
      const factor = (index + 1) / particles.length;
      particle.style.transform = `translateY(${-y * 50 * factor}px) translateX(${x * 30 * factor}px) rotate(${x * y * 360 * factor}deg)`;
    });
  }
}

// Fonction pour réinitialiser la transformation de l'image
function resetImageTransform(container, image, depthLayer, borderLayer, gridLayer, highlightLayer, particles) {
  // Réinitialiser le conteneur
  container.style.transform = '';
  
  // Réinitialiser l'image
  if (image) {
    image.style.transform = '';
    image.style.filter = '';
  }
  
  // Réinitialiser la couche de profondeur
  if (depthLayer) {
    depthLayer.style.transform = 'translateZ(-20px)';
    depthLayer.style.boxShadow = '';
  }
  
  // Réinitialiser la bordure
  if (borderLayer) {
    borderLayer.style.transform = 'translateZ(10px)';
  }
  
  // Réinitialiser la grille
  if (gridLayer) {
    gridLayer.style.transform = 'translateZ(5px)';
    gridLayer.style.backgroundPosition = '';
  }
  
  // Réinitialiser la couche de surbrillance
  if (highlightLayer) {
    highlightLayer.style.transform = 'translateZ(15px)';
    highlightLayer.style.background = '';
  }
  
  // Réinitialiser les particules
  if (particles && particles.length) {
    particles.forEach(particle => {
      particle.style.transform = '';
    });
  }
};

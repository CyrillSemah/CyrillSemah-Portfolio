// Animation dynamique pour l'arrière-plan avec grille
document.addEventListener('turbo:load', function() {
  console.log('turbo:load fired - initialisation des effets pour la grille d\'arrière-plan');
  initializeGridBackgroundEffect();
});

document.addEventListener('DOMContentLoaded', function() {
  console.log('DOMContentLoaded fired - initialisation des effets pour la grille d\'arrière-plan');
  initializeGridBackgroundEffect();
});

// Exécuter immédiatement pour être sûr
initializeGridBackgroundEffect();

function initializeGridBackgroundEffect() {
  console.log('Initialisation des effets pour la grille d\'arrière-plan...');
  
  // Sélectionner le conteneur de l'arrière-plan
  const gridBackground = document.querySelector('.grid-background');
  
  if (!gridBackground) {
    console.log('La grille d\'arrière-plan n\'a pas été trouvée');
    return;
  }
  
  console.log('Grille d\'arrière-plan trouvée, ajout des effets dynamiques');
  
  // Ajouter un effet de parallaxe au mouvement de la souris
  addMouseParallaxEffect(gridBackground);
  
  // Ajouter des points lumineux aléatoires
  addRandomLightPoints(gridBackground);
  
  console.log('Initialisation des effets pour la grille d\'arrière-plan terminée');
}

// Fonction pour ajouter un effet de parallaxe au mouvement de la souris
function addMouseParallaxEffect(container) {
  const gridContainer = container.querySelector('.grid-background__container');
  const gridMain = container.querySelector('.grid-background__main');
  const horizontalLines = container.querySelector('.grid-background__horizontal-lines');
  const verticalLines = container.querySelector('.grid-background__vertical-lines');
  const dots = container.querySelector('.grid-background__dots');
  
  document.addEventListener('mousemove', function(e) {
    // Calculer la position relative de la souris sur la fenêtre (de -1 à 1)
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = (e.clientY / window.innerHeight) * 2 - 1;
    
    // Appliquer un effet de parallaxe à chaque élément
    if (gridContainer) {
      gridContainer.style.transform = `translate3d(${x * -20}px, ${y * -20}px, 0)`;
    }
    
    if (gridMain) {
      gridMain.style.transform = `perspective(1000px) rotateX(${60 + y * 5}deg) rotateZ(${x * 2}deg)`;
    }
    
    if (horizontalLines) {
      horizontalLines.style.transform = `translateY(${y * 10}px)`;
    }
    
    if (verticalLines) {
      verticalLines.style.transform = `translateX(${x * 10}px)`;
    }
    
    if (dots) {
      dots.style.transform = `translate(${x * 5}px, ${y * 5}px)`;
    }
  });
}

// Fonction pour ajouter des points lumineux aléatoires
function addRandomLightPoints(container) {
  // Créer un conteneur pour les points lumineux
  const lightPointsContainer = document.createElement('div');
  lightPointsContainer.className = 'grid-background__light-points';
  lightPointsContainer.style.position = 'absolute';
  lightPointsContainer.style.top = '0';
  lightPointsContainer.style.left = '0';
  lightPointsContainer.style.width = '100%';
  lightPointsContainer.style.height = '100%';
  lightPointsContainer.style.pointerEvents = 'none';
  container.appendChild(lightPointsContainer);
  
  // Créer des points lumineux aléatoires
  const numberOfPoints = 30;
  
  for (let i = 0; i < numberOfPoints; i++) {
    createLightPoint(lightPointsContainer);
  }
  
  // Créer de nouveaux points toutes les 3 secondes
  setInterval(function() {
    // Supprimer un point aléatoire
    const points = lightPointsContainer.querySelectorAll('.grid-background__light-point');
    if (points.length > 0) {
      const randomIndex = Math.floor(Math.random() * points.length);
      points[randomIndex].remove();
    }
    
    // Ajouter un nouveau point
    createLightPoint(lightPointsContainer);
  }, 3000);
}

// Fonction pour créer un point lumineux
function createLightPoint(container) {
  const point = document.createElement('div');
  point.className = 'grid-background__light-point';
  
  // Style du point
  point.style.position = 'absolute';
  point.style.width = `${Math.random() * 4 + 2}px`;
  point.style.height = point.style.width;
  point.style.backgroundColor = 'rgba(100, 150, 255, 0.7)';
  point.style.borderRadius = '50%';
  point.style.filter = 'blur(1px)';
  point.style.boxShadow = '0 0 10px rgba(100, 150, 255, 0.9)';
  
  // Position aléatoire
  point.style.top = `${Math.random() * 100}%`;
  point.style.left = `${Math.random() * 100}%`;
  
  // Animation
  point.style.opacity = '0';
  point.style.transition = 'opacity 1s ease-in-out, transform 20s linear';
  
  // Ajouter au conteneur
  container.appendChild(point);
  
  // Démarrer l'animation après un court délai
  setTimeout(function() {
    point.style.opacity = '1';
    point.style.transform = `translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px)`;
    
    // Faire disparaître le point après un délai aléatoire
    setTimeout(function() {
      point.style.opacity = '0';
      
      // Supprimer le point du DOM après la fin de l'animation
      setTimeout(function() {
        point.remove();
      }, 1000);
    }, Math.random() * 10000 + 5000);
  }, 100);
};

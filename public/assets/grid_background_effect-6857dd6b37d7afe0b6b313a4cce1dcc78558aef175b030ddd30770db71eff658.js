// Animation dynamique pour l'arrière-plan avec grille
let gridInitialized = false;

// Attendre que le DOM soit complètement chargé
document.addEventListener('DOMContentLoaded', function() {
  // Attendre un court instant pour s'assurer que le DOM est complètement chargé
  setTimeout(checkAndInitializeGrid, 100);
});

// Fonction pour vérifier et initialiser la grille
function checkAndInitializeGrid() {
  // Vérifier si la grille existe
  const gridBackground = document.querySelector('.grid-background');
  
  if (gridBackground) {
    // La grille existe, initialiser les effets
    initializeGridBackgroundEffect();
  } else {
    // La grille n'existe pas, vérifier périodiquement
    startGridCheckInterval();
  }
}

// Vérifier périodiquement si la grille est disponible
function startGridCheckInterval() {
  let attempts = 0;
  const maxAttempts = 10; // Limiter le nombre de tentatives
  
  const gridCheckInterval = setInterval(function() {
    attempts++;
    const gridBackground = document.querySelector('.grid-background');
    
    if (gridBackground && !gridInitialized) {
      initializeGridBackgroundEffect();
      clearInterval(gridCheckInterval);
    } else if (attempts >= maxAttempts) {
      // Arrêter de vérifier après un certain nombre de tentatives
      clearInterval(gridCheckInterval);
    }
  }, 500);
}

function initializeGridBackgroundEffect() {
  // Éviter les initialisations multiples
  if (gridInitialized) {
    return;
  }
  
  // Sélectionner le conteneur de l'arrière-plan
  const gridBackground = document.querySelector('.grid-background');
  
  if (!gridBackground) {
    // Ne pas afficher de message d'erreur, simplement retourner
    return;
  }
  
  // Marquer comme initialisé
  gridInitialized = true;
  
  // Ajouter un effet de parallaxe au mouvement de la souris
  addMouseParallaxEffect(gridBackground);
  
  // Ajouter des points lumineux aléatoires
  addRandomLightPoints(gridBackground);
  
  // Initialisation des effets pour la grille d'arrière-plan terminée
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
  const numberOfPoints = 50;
  
  for (let i = 0; i < numberOfPoints; i++) {
    createLightPoint(lightPointsContainer);
  }
  
  // Créer de nouveaux points plus fréquemment (toutes les 1.5 secondes)
  setInterval(function() {
    // Supprimer deux points aléatoires
    const points = lightPointsContainer.querySelectorAll('.grid-background__light-point');
    if (points.length > 2) {
      for (let i = 0; i < 2; i++) {
        const randomIndex = Math.floor(Math.random() * points.length);
        points[randomIndex].remove();
      }
    } else if (points.length > 0) {
      const randomIndex = Math.floor(Math.random() * points.length);
      points[randomIndex].remove();
    }
    
    // Ajouter trois nouveaux points
    for (let i = 0; i < 3; i++) {
      createLightPoint(lightPointsContainer);
    }
  }, 1500);
}

// Fonction pour créer un point lumineux
function createLightPoint(container) {
  const point = document.createElement('div');
  point.className = 'grid-background__light-point';
  
  // Style du point avec plus de variété et d'éclat
  point.style.position = 'absolute';
  
  // Taille variable pour plus de diversité
  const size = Math.random() * 5 + 2;
  point.style.width = `${size}px`;
  point.style.height = `${size}px`;
  
  // Couleurs variées pour plus de réalisme
  const blueIntensity = Math.floor(Math.random() * 55) + 200; // 200-255
  const colorIntensity = Math.floor(Math.random() * 30) + 70; // 70-100
  point.style.backgroundColor = `rgba(${colorIntensity}, ${colorIntensity + 50}, ${blueIntensity}, 0.85)`;
  
  point.style.borderRadius = '50%';
  point.style.filter = 'blur(0.5px)';
  
  // Éclat plus intense pour certaines étoiles
  const glowIntensity = Math.random() > 0.7 ? 15 : 8;
  point.style.boxShadow = `0 0 ${glowIntensity}px rgba(${colorIntensity}, ${colorIntensity + 50}, ${blueIntensity}, 0.95)`;
  
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

// Nuage de tags 3D pour les compétences personnelles
document.addEventListener('DOMContentLoaded', function() {
  // Vérifier si l'élément canvas existe
  const canvas = document.getElementById('soft-skills-canvas');
  if (!canvas) return;

  // Charger TagCanvas de manière fiable
  loadTagCanvas();
});

// Variable pour suivre l'initialisation
let tagCanvasInitialized = false;

// Fonction pour charger TagCanvas
function loadTagCanvas() {
  // Vérifier si TagCanvas est déjà disponible
  if (window.TagCanvas) {
    // TagCanvas déjà chargé, initialisation...
    setTimeout(initializeTagCanvas, 100);
    return;
  }
  
  // Chargement de TagCanvas...
  
  // Créer et charger le script TagCanvas
  const script = document.createElement('script');
  script.src = 'https://www.goat1000.com/tagcanvas.min.js';
  script.async = false;
  
  script.onload = function() {
    // TagCanvas chargé avec succès
    setTimeout(initializeTagCanvas, 100);
  };
  
  script.onerror = function() {
    console.error('Erreur lors du chargement de TagCanvas, tentative avec un CDN alternatif...');
    const fallbackScript = document.createElement('script');
    fallbackScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/tagcanvas/2.9/tagcanvas.min.js';
    fallbackScript.async = false;
    
    fallbackScript.onload = function() {
      // TagCanvas chargé depuis le CDN alternatif
      setTimeout(initializeTagCanvas, 100);
    };
    
    fallbackScript.onerror = function() {
      console.error('Impossible de charger TagCanvas. Le nuage de tags ne sera pas disponible.');
    };
    
    document.head.appendChild(fallbackScript);
  };
  
  document.head.appendChild(script);
}

// Fonction pour initialiser TagCanvas
function initializeTagCanvas() {
  if (tagCanvasInitialized) return;
  
  try {
    const canvasId = 'soft-skills-canvas';
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    // Ajouter des gestionnaires d'événements pour le clic maintenu
    let savedSpeed = null;
    let isMouseDown = false;
    
    canvas.addEventListener('mousedown', function() {
      isMouseDown = true;
      if (window.TagCanvas && TagCanvas.tc && TagCanvas.tc[canvasId]) {
        savedSpeed = TagCanvas.tc[canvasId].maxSpeed;
        TagCanvas.SetSpeed(canvasId, [0, 0]);
      }
    });
    
    canvas.addEventListener('touchstart', function() {
      if (window.TagCanvas && TagCanvas.tc && TagCanvas.tc[canvasId]) {
        savedSpeed = TagCanvas.tc[canvasId].maxSpeed;
        TagCanvas.SetSpeed(canvasId, [0, 0]);
      }
    }, { passive: true });
    
    document.addEventListener('mouseup', function() {
      isMouseDown = false;
      if (savedSpeed && window.TagCanvas) {
        TagCanvas.SetSpeed(canvasId, savedSpeed);
      }
    });
    
    document.addEventListener('touchend', function() {
      if (savedSpeed && window.TagCanvas) {
        TagCanvas.SetSpeed(canvasId, savedSpeed);
      }
    }, { passive: true });
    
    canvas.addEventListener('mouseleave', function() {
      if (isMouseDown && savedSpeed !== null) {
        isMouseDown = false;
        TagCanvas.SetSpeed(canvasId, savedSpeed);
      }
    });
    
    // Configurer et démarrer TagCanvas
    TagCanvas.Start('soft-skills-canvas', 'soft-skills-tags', {
      textColour: '#3366cc',
      outlineColour: 'transparent',
      reverse: true,
      depth: 0.8,
      maxSpeed: 0.015,
      weight: false,
      initial: [0.05, -0.05],
      wheelZoom: false,
      freezeActive: true,
      freezeDecel: false,
      shuffleTags: true,
      shape: 'sphere',
      zoom: 1.3,
      noSelect: true,
      noMouse: false,
      textHeight: 28,
      textFont: null,
      shadowBlur: 5,
      shadowOffset: [1,1],
      stretchX: 1.2,
      animTiming: 'Smooth',
      clickToFront: 500,
      fadeIn: 1000,
      padding: 10,
      bgColour: 'transparent',
      bgOutlineThickness: 0,
      bgRadius: 5,
      activeCursor: 'pointer',
      decel: 0.90,
      hideTags: false,
      minSpeed: 0.01,
      radiusX: 1,
      radiusY: 1,
      radiusZ: 1,
      pinchZoom: true,
      dragControl: true,
      centreFunc: function() { return [0, 0]; }
    });
    
    // Fonction pour redimensionner le canvas
    function resizeCanvas() {
      const container = document.querySelector('.soft-skills-canvas-container');
      if (!container || !canvas) return;
      
      const width = container.offsetWidth;
      const height = container.offsetHeight || 400;
      
      canvas.width = width;
      canvas.height = height;
      
      if (window.TagCanvas) {
        try {
          TagCanvas.Reload('soft-skills-canvas');
        } catch(e) {
          console.error('Erreur lors du redimensionnement:', e);
        }
      }
    }
    
    // Redimensionner le canvas lors du chargement et du redimensionnement
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    tagCanvasInitialized = true;
    // TagCanvas initialisé avec succès
    
  } catch(e) {
    console.error('Erreur lors de l\'initialisation de TagCanvas:', e);
  }
}

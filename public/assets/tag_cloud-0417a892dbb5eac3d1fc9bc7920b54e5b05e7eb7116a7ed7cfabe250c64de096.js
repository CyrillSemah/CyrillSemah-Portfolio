// Nuage de tags 3D pour les compétences personnelles
document.addEventListener('DOMContentLoaded', function() {
  // Vérifier si l'élément canvas existe
  const canvas = document.getElementById('soft-skills-canvas');
  if (!canvas) return;

  // Vérifier si TagCanvas est disponible
  if (!window.TagCanvas) {
    console.warn('TagCanvas non disponible, chargement de la bibliothèque...');
    
    // Créer et charger le script TagCanvas
    const script = document.createElement('script');
    script.src = 'https://www.goat1000.com/tagcanvas.min.js';
    script.async = true;
    
    script.onload = function() {
      initializeTagCanvas();
    };
    
    document.head.appendChild(script);
  } else {
    initializeTagCanvas();
  }
  
  function initializeTagCanvas() {
    try {
      // Démarrer le canvas
      const canvasId = 'soft-skills-canvas';
      const canvas = document.getElementById(canvasId);
      
      // Ajouter des gestionnaires d'événements pour le clic maintenu
      let isMouseDown = false;
      let savedSpeed = null;
      
      canvas.addEventListener('mousedown', function() {
        isMouseDown = true;
        // Sauvegarder la vitesse actuelle et arrêter le mouvement
        savedSpeed = TagCanvas.tc[canvasId].maxSpeed;
        TagCanvas.SetSpeed(canvasId, [0, 0]);
      });
      
      canvas.addEventListener('mouseup', function() {
        isMouseDown = false;
        // Restaurer la vitesse précédente
        if (savedSpeed !== null) {
          TagCanvas.SetSpeed(canvasId, savedSpeed);
        }
      });
      
      canvas.addEventListener('mouseleave', function() {
        // Si la souris quitte le canvas pendant un clic maintenu
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
        maxSpeed: 0.015,         // Vitesse encore plus réduite pour une animation plus lente
        weight: false,           // Désactivation du poids variable
        initial: [0.05, -0.05],  // Rotation initiale plus lente
        wheelZoom: false,
        freezeActive: true,
        freezeDecel: false,       // Désactivé pour que le mouvement continue après interaction
        shuffleTags: true,
        shape: 'sphere',
        zoom: 1.3,               // Zoom augmenté pour un nuage plus grand
        noSelect: true,
        noMouse: false,
        textHeight: 28,          // Hauteur de texte augmentée
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
        decel: 0.90,             // Décélération réduite pour un mouvement plus long
        hideTags: false,
        minSpeed: 0.01,          // Vitesse minimale pour maintenir le mouvement
        radiusX: 1,
        radiusY: 1,
        radiusZ: 1,
        pinchZoom: true,
        activeAudio: '',
        audioVolume: 1.0,
        dragControl: true,
        textColour: '#3366cc',    // Couleur de texte uniforme
        outlineMethod: 'none',    // Pas de contour pour une meilleure lisibilité
        outlineIncrease: 3,       // Augmentation de la taille au survol
        depth: 0.92,              // Profondeur légèrement augmentée
        minBrightness: 0.5,       // Luminosité minimale pour les mots à l'arrière
        maxBrightness: 1.0,       // Luminosité maximale pour les mots à l'avant
        shadowBlur: 4,            // Ombre légère pour la profondeur
        shadowOffset: [1,1],      // Décalage de l'ombre
        imageScale: 2,            // Échelle des images (si utilisées)
        fadeIn: 800,              // Animation d'apparition plus rapide
        weightMode: 'both',       // Mode de poids (taille et couleur)
        weightSize: 1.0,          // Facteur de taille uniforme
        initial: [0.1, 0.1],      // Rotation initiale
        lock: null,               // Pas de verrouillage d'axe
        tooltip: null,            // Pas d'infobulle
        tooltipDelay: 0,          // Délai d'affichage de l'infobulle
        txtOpt: true,             // Optimisation du texte
        txtScale: 2,              // Échelle du texte
        frontSelect: true,        // Sélection des éléments de devant
        wheelZoom: false,         // Désactivation du zoom à la molette
        zoomMin: 0.3,             // Zoom minimum
        zoomMax: 3,               // Zoom maximum
        zoomStep: 0.05,           // Pas de zoom
        interval: 20,             // Intervalle de rafraîchissement
        centreFunc: function(x, y) { return [0, 0]; },  // Fonction de centrage définie correctement
        splitWidth: 0             // Largeur de séparation
      });
    } catch(e) {
      console.error('Erreur lors de l\'initialisation de TagCanvas:', e);
      document.getElementById('soft-skills-container').style.display = 'block';
      document.getElementById('soft-skills-canvas-container').style.display = 'none';
    }
  }
  
  // Ajuster la taille du canvas en fonction de la fenêtre
  function resizeCanvas() {
    const container = document.getElementById('soft-skills-canvas-container');
    if (container) {
      const width = container.offsetWidth;
      const height = Math.max(400, window.innerHeight * 0.4);
      
      canvas.width = width;
      canvas.height = height;
      
      // Redémarrer TagCanvas avec les nouvelles dimensions
      if (window.TagCanvas) {
        try {
          TagCanvas.Reload('soft-skills-canvas');
        } catch(e) {
          console.error('Erreur lors du redimensionnement:', e);
        }
      }
    }
  }
  
  // Redimensionner le canvas lors du chargement et du redimensionnement de la fenêtre
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
});

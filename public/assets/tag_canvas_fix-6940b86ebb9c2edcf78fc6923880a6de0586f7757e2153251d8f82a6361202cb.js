// Correctif pour les événements non passifs de TagCanvas
document.addEventListener('DOMContentLoaded', function() {
  // Attendre que TagCanvas soit chargé
  const checkTagCanvas = setInterval(function() {
    if (window.TagCanvas) {
      console.log('Application du correctif pour TagCanvas');
      clearInterval(checkTagCanvas);
      applyTagCanvasFix();
    }
  }, 100);
});

// Fonction pour corriger les événements non passifs
function applyTagCanvasFix() {
  // Sauvegarder les fonctions originales
  const originalAddListener = EventTarget.prototype.addEventListener;
  
  // Remplacer la fonction addEventListener pour ajouter l'option passive
  EventTarget.prototype.addEventListener = function(type, listener, options) {
    // Pour les événements tactiles, forcer l'option passive
    if (type === 'touchstart' || type === 'touchmove' || type === 'touchend') {
      let newOptions = options;
      
      // Si les options sont un objet, ajouter passive: true
      if (typeof options === 'object') {
        newOptions = Object.assign({}, options, { passive: true });
      } 
      // Si les options sont un booléen ou undefined, créer un nouvel objet
      else {
        newOptions = { 
          capture: options === true, 
          passive: true 
        };
      }
      
      // Appeler la fonction originale avec les nouvelles options
      return originalAddListener.call(this, type, listener, newOptions);
    }
    
    // Pour les autres événements, comportement normal
    return originalAddListener.call(this, type, listener, options);
  };
  
  // Réinitialiser TagCanvas si nécessaire
  if (window.TagCanvas && typeof TagCanvas.Reload === 'function') {
    try {
      const canvas = document.getElementById('soft-skills-canvas');
      if (canvas) {
        console.log('Réinitialisation de TagCanvas avec les événements passifs');
        TagCanvas.Reload('soft-skills-canvas');
      }
    } catch (e) {
      console.error('Erreur lors de la réinitialisation de TagCanvas:', e);
    }
  }
  
  console.log('Correctif pour TagCanvas appliqué avec succès');
};

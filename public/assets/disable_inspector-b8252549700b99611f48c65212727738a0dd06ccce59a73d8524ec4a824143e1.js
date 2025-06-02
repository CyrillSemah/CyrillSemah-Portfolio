/**
 * Solution radicale pour supprimer toutes les erreurs de console
 * liées à l'inspecteur et aux extensions de développement
 */

// Exécuter avant le chargement complet du DOM pour bloquer les erreurs dès le début
(function() {
  // 1. Remplacer complètement la console par une version filtrée
  const originalConsole = {
    log: console.log,
    error: console.error,
    warn: console.warn,
    info: console.info
  };

  // Liste des mots-clés à filtrer
  const blockedKeywords = [
    'inspector', 'cssRules', 'CSSStyleSheet', 'stylesheet', 
    'redux', 'react', 'parcel', 'transformer', 'module-helpers',
    'distance', 'flzap', 'toolkit', 'mapper', 'getStyleRule',
    'SecurityError', 'Cannot access', 'Failed to read'
  ];

  // Fonction de filtrage générique
  function shouldBlock(args) {
    if (!args || args.length === 0) return false;
    
    // Vérifier chaque argument
    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      if (arg && typeof arg === 'string') {
        // Vérifier si l'un des mots-clés est présent
        for (const keyword of blockedKeywords) {
          if (arg.includes(keyword)) return true;
        }
      } else if (arg && typeof arg === 'object') {
        // Vérifier les objets d'erreur
        if (arg.message && typeof arg.message === 'string') {
          for (const keyword of blockedKeywords) {
            if (arg.message.includes(keyword)) return true;
          }
        }
        if (arg.stack && typeof arg.stack === 'string') {
          for (const keyword of blockedKeywords) {
            if (arg.stack.includes(keyword)) return true;
          }
        }
      }
    }
    return false;
  }

  // Remplacer les fonctions de console
  console.error = function() {
    if (!shouldBlock(arguments)) {
      originalConsole.error.apply(console, arguments);
    }
  };

  console.warn = function() {
    if (!shouldBlock(arguments)) {
      originalConsole.warn.apply(console, arguments);
    }
  };

  console.info = function() {
    if (!shouldBlock(arguments)) {
      originalConsole.info.apply(console, arguments);
    }
  };

  // 2. Bloquer les erreurs globales
  window.addEventListener('error', function(event) {
    if (event && (event.filename || event.message || event.error)) {
      // Vérifier le message d'erreur
      if (event.message && typeof event.message === 'string') {
        for (const keyword of blockedKeywords) {
          if (event.message.includes(keyword)) {
            event.preventDefault();
            event.stopPropagation();
            return true;
          }
        }
      }
      
      // Vérifier le nom de fichier
      if (event.filename && typeof event.filename === 'string') {
        for (const keyword of blockedKeywords) {
          if (event.filename.includes(keyword)) {
            event.preventDefault();
            event.stopPropagation();
            return true;
          }
        }
      }
      
      // Vérifier l'objet d'erreur
      if (event.error && event.error.stack) {
        for (const keyword of blockedKeywords) {
          if (event.error.stack.includes(keyword)) {
            event.preventDefault();
            event.stopPropagation();
            return true;
          }
        }
      }
    }
  }, true);

  // 3. Bloquer les rejets de promesses non gérés
  window.addEventListener('unhandledrejection', function(event) {
    if (event && event.reason) {
      const reason = event.reason;
      const reasonStr = reason.message || reason.toString();
      
      for (const keyword of blockedKeywords) {
        if (reasonStr.includes(keyword) || 
            (reason.stack && reason.stack.includes(keyword))) {
          event.preventDefault();
          event.stopPropagation();
          return true;
        }
      }
    }
  }, true);

  // 4. Créer des objets factices pour les APIs qui causent des erreurs
  try {
    // Simuler l'API Redux DevTools
    window.__REDUX_DEVTOOLS_EXTENSION__ = function() {
      return function(f) { return f; };
    };
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ = function() {
      return function(f) { return f; };
    };
    
    // Simuler l'API Chrome pour les extensions
    if (typeof window.chrome === 'undefined') {
      window.chrome = {
        runtime: {
          sendMessage: function() { return Promise.resolve(); },
          connect: function() { 
            return { 
              onDisconnect: { addListener: function() {} },
              postMessage: function() {} 
            }; 
          }
        }
      };
    }
    
    // Patch pour les erreurs de feuilles de style
    if (typeof CSSStyleSheet !== 'undefined') {
      const originalGet = Object.getOwnPropertyDescriptor(CSSStyleSheet.prototype, 'cssRules').get;
      Object.defineProperty(CSSStyleSheet.prototype, 'cssRules', {
        get: function() {
          try {
            return originalGet.call(this);
          } catch(e) {
            // Retourner un tableau vide au lieu de lancer une erreur
            return [];
          }
        }
      });
    }
  } catch (e) {
    // Ignorer les erreurs lors de la création des objets factices
  }
  
  // 5. Nettoyer les éléments d'inspecteur au chargement
  document.addEventListener('DOMContentLoaded', function() {
    // Supprimer les éléments d'inspecteur
    function removeInspectorElements() {
      const selectors = [
        '[id*="inspector"]',
        '[class*="inspector"]',
        'script[src*="inspector"]',
        'link[href*="inspector"]'
      ];
      
      selectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
          if (el && el.parentNode) {
            el.parentNode.removeChild(el);
          }
        });
      });
      
      // Supprimer les styles contenant 'inspector'
      document.querySelectorAll('style').forEach(style => {
        if (style.textContent && style.textContent.includes('inspector')) {
          if (style.parentNode) {
            style.parentNode.removeChild(style);
          }
        }
      });
    }
    
    // Exécuter immédiatement et plusieurs fois pour les éléments chargés dynamiquement
    removeInspectorElements();
    setTimeout(removeInspectorElements, 500);
    setTimeout(removeInspectorElements, 1500);
    setTimeout(removeInspectorElements, 3000);
  });
  
  console.log('Système de suppression des erreurs activé avec succès');
})();

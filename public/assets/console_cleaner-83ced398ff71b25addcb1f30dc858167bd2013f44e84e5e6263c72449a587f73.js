// Script pour supprimer tous les logs de la console pour les visiteurs
(function() {
  // Détecter si nous sommes en mode admin ou en mode visiteur
  const isAdminMode = window.location.pathname.includes('/admin');
  
  // Fonction pour nettoyer la console
  function cleanConsole() {
    // Sauvegarder la console originale pour le débogage si nécessaire
    window._originalConsole = {
      log: console.log,
      info: console.info,
      warn: console.warn,
      error: console.error,
      debug: console.debug,
      trace: console.trace
    };
    
    // Fonction vide pour remplacer les méthodes de console
    const noop = function() {};
    
    // Remplacer toutes les méthodes de la console
    console.log = noop;
    console.info = noop;
    console.warn = noop;
    console.error = noop;
    console.debug = noop;
    console.trace = noop;
    
    // Supprimer également les logs existants
    if (typeof console.clear === 'function') {
      console.clear();
    }
    
    // Intercepter les erreurs non capturées
    window.addEventListener('error', function(event) {
      // Empêcher l'affichage des erreurs dans la console
      event.preventDefault();
      return true;
    }, true);
    
    // Intercepter les rejets de promesses non capturés
    window.addEventListener('unhandledrejection', function(event) {
      // Empêcher l'affichage des erreurs dans la console
      event.preventDefault();
      return true;
    }, true);
  }
  
  // Restaurer la console originale si nécessaire
  function restoreConsole() {
    if (window._originalConsole) {
      console.log = window._originalConsole.log;
      console.info = window._originalConsole.info;
      console.warn = window._originalConsole.warn;
      console.error = window._originalConsole.error;
      console.debug = window._originalConsole.debug;
      console.trace = window._originalConsole.trace;
    }
  }
  
  // Nettoyer la console immédiatement pour éviter les logs pendant le chargement
  if (!isAdminMode) {
    cleanConsole();
  }
  
  // S'assurer que la console est nettoyée après le chargement complet
  document.addEventListener('DOMContentLoaded', function() {
    if (!isAdminMode) {
      // Mode visiteur: nettoyer la console
      cleanConsole();
    } else {
      // Mode admin: restaurer la console si elle a été nettoyée
      restoreConsole();
      console.info('Mode admin: logs de console activés');
    }
  });
  
  // S'assurer que la console est nettoyée après la navigation Turbo
  document.addEventListener('turbo:load', function() {
    if (!isAdminMode) {
      // Mode visiteur: nettoyer la console
      cleanConsole();
    } else {
      // Mode admin: restaurer la console
      restoreConsole();
    }
  });
})();

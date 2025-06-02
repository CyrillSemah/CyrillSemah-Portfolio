// Script pour supprimer tous les logs de la console pour les visiteurs
(function() {
  // Détecter si nous sommes en mode admin ou en mode visiteur
  const isAdminMode = window.location.pathname.includes('/admin');
  
  // Fonction pour nettoyer la console sans laisser de trace
  function cleanConsole() {
    try {
      // Sauvegarder la console originale pour le débogage si nécessaire
      window._originalConsole = {
        log: console.log,
        info: console.info,
        warn: console.warn,
        error: console.error,
        debug: console.debug,
        trace: console.trace,
        clear: console.clear
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
      
      // Remplacer console.clear pour éviter le message "Les données de la console ont été effacées"
      console.clear = noop;
      
      // Technique avancée pour effacer la console sans message
      if (window.console) {
        // Méthode 1: Utiliser CSS pour masquer les messages de la console
        const style = document.createElement('style');
        style.textContent = `
          .console-message-wrapper, .console-message, .console-user-command {
            display: none !important;
          }
        `;
        document.head.appendChild(style);
        
        // Méthode 2: Utiliser une iframe pour réinitialiser complètement la console
        try {
          const iframe = document.createElement('iframe');
          iframe.style.display = 'none';
          document.body.appendChild(iframe);
          window.console = iframe.contentWindow.console;
          // Remplacer à nouveau les méthodes pour s'assurer que tout est vide
          window.console.log = noop;
          window.console.info = noop;
          window.console.warn = noop;
          window.console.error = noop;
          window.console.debug = noop;
          window.console.trace = noop;
          window.console.clear = noop;
        } catch (e) {
          // Ignorer les erreurs silencieusement
        }
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
    } catch (e) {
      // Ignorer les erreurs silencieusement
    }
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

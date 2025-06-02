// Script de transition directe entre les sections
document.addEventListener('DOMContentLoaded', function() {
  console.log('Script de transitions directes chargé');
  
  // Fonction pour créer une transition entre deux sections
  function createTransition(fromSectionId, toSectionId, transitionName) {
    // Trouver les sections
    const fromSection = document.getElementById(fromSectionId);
    const toSection = document.getElementById(toSectionId);
    
    if (!fromSection || !toSection) {
      console.error(`Sections non trouvées: ${fromSectionId} ou ${toSectionId}`);
      return;
    }
    
    console.log(`Transition créée entre ${fromSectionId} et ${toSectionId}`);
    
    // Créer le conteneur de transition
    const transitionContainer = document.createElement('div');
    transitionContainer.className = `direct-transition ${transitionName}-transition`;
    transitionContainer.style.position = 'fixed';
    transitionContainer.style.top = '0';
    transitionContainer.style.left = '0';
    transitionContainer.style.width = '100vw';
    transitionContainer.style.height = '100vh';
    transitionContainer.style.pointerEvents = 'none';
    transitionContainer.style.zIndex = '999';
    transitionContainer.style.opacity = '0';
    transitionContainer.style.transition = 'opacity 0.3s ease';
    transitionContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
    document.body.appendChild(transitionContainer);
    
    // Créer des lignes de code pour la transition
    for (let i = 0; i < 20; i++) {
      createCodeLine(transitionContainer, i);
    }
    
    // Surveiller le défilement
    window.addEventListener('scroll', function() {
      // Positions des sections
      const fromSectionRect = fromSection.getBoundingClientRect();
      const toSectionRect = toSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Zone de transition: quand la section "from" sort de l'écran et que la section "to" entre
      const transitionPoint = windowHeight * 0.8; // 80% de la hauteur de la fenêtre
      
      // Si la section "from" sort par le haut et la section "to" entre par le bas
      if (fromSectionRect.bottom < transitionPoint && toSectionRect.top < windowHeight) {
        // Calculer la progression (0 à 1)
        const progress = Math.min(1, (transitionPoint - fromSectionRect.bottom) / transitionPoint);
        
        console.log(`Progression ${transitionName}: ${progress.toFixed(2)}, fromBottom: ${fromSectionRect.bottom}, toTop: ${toSectionRect.top}`);
        
        // Afficher la transition
        transitionContainer.style.opacity = Math.min(1, progress * 2);
        
        // Animer les lignes de code
        const codeLines = transitionContainer.querySelectorAll('.code-line');
        codeLines.forEach((line, index) => {
          const delay = index * 0.05;
          const lineProgress = Math.max(0, Math.min(1, (progress * 3) - delay));
          
          line.style.opacity = lineProgress;
          
          if (index % 2 === 0) {
            line.style.transform = `translateX(${(1 - lineProgress) * 50}px)`;
          } else {
            line.style.transform = `translateX(${(1 - lineProgress) * -50}px)`;
          }
        });
      } else {
        // Masquer la transition
        transitionContainer.style.opacity = '0';
      }
    });
  }
  
  // Fonction pour créer une ligne de code
  function createCodeLine(container, index) {
    const line = document.createElement('div');
    line.className = 'code-line';
    line.style.position = 'absolute';
    line.style.display = 'flex';
    line.style.alignItems = 'center';
    line.style.opacity = '0';
    line.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    line.style.whiteSpace = 'nowrap';
    line.style.fontSize = '14px';
    line.style.lineHeight = '1.5';
    line.style.marginBottom = '5px';
    line.style.transform = 'translateX(50px)';
    line.style.backgroundColor = 'rgba(43, 63, 138, 0.1)';
    line.style.padding = '2px 8px';
    line.style.borderRadius = '4px';
    line.style.maxWidth = '80vw';
    line.style.overflow = 'hidden';
    line.style.color = 'white';
    line.style.fontFamily = 'Courier New, monospace';
    line.style.textShadow = '0 0 2px rgba(43, 63, 138, 0.5)';
    
    // Position verticale
    const top = (Math.random() * 70) + 10; // Entre 10% et 80% de la hauteur
    line.style.top = top + '%';
    
    // Position horizontale
    if (index % 2 === 0) {
      // Position à gauche
      const left = (Math.random() * 25) + 5; // Entre 5% et 30% de la largeur
      line.style.left = left + '%';
    } else {
      // Position à droite
      const right = (Math.random() * 25) + 5; // Entre 5% et 30% de la largeur depuis la droite
      line.style.right = right + '%';
    }
    
    // Contenu de la ligne
    const codeSnippets = [
      'function transition() { }',
      'const section = document.querySelector(".section");',
      '.transition { opacity: 0; }',
      'animation: fadeIn 0.5s ease;',
      'transform: translateY(30px);',
      '<div class="section-content">',
      'export default class Transition { }',
      '@keyframes slideIn { from { } to { } }',
      'transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);',
      'window.addEventListener("scroll", handleScroll);'
    ];
    
    // Numéro de ligne
    const lineNumber = document.createElement('span');
    lineNumber.style.display = 'inline-block';
    lineNumber.style.minWidth = '30px';
    lineNumber.style.color = 'rgba(255, 255, 255, 0.5)';
    lineNumber.style.marginRight = '10px';
    lineNumber.style.textAlign = 'right';
    lineNumber.textContent = (index + 1).toString().padStart(2, '0');
    
    // Texte de code
    const codeText = document.createElement('span');
    codeText.style.color = 'white';
    codeText.style.fontWeight = '400';
    codeText.textContent = codeSnippets[index % codeSnippets.length];
    
    // Assembler la ligne
    line.appendChild(lineNumber);
    line.appendChild(codeText);
    
    // Ajouter la ligne au conteneur
    container.appendChild(line);
    
    return line;
  }
  
  // Créer les transitions entre les sections
  setTimeout(() => {
    // Transition entre Accueil et Expériences Pro
    createTransition('home', 'xp-pro', 'home-xp');
    
    // Transition entre Expériences Pro et Formation
    createTransition('xp-pro', 'education', 'xp-education');
    
    // Transition entre Formation et Compétences
    createTransition('education', 'skills', 'education-skills');
    
    // Transition entre Compétences et Projets (si la section existe)
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
      createTransition('skills', 'projects', 'skills-projects');
    }
  }, 1000); // Attendre 1 seconde pour s'assurer que le DOM est complètement chargé
});

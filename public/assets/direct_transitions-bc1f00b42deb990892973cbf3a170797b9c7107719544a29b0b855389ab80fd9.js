// Script de transition directe entre les sections
document.addEventListener('DOMContentLoaded', function() {
  console.log('Script de transitions directes chargé');
  
  // Créer un seul conteneur de transition pour toutes les sections
  const transitionContainer = document.createElement('div');
  transitionContainer.className = 'code-transition-container';
  transitionContainer.style.position = 'fixed';
  transitionContainer.style.top = '0';
  transitionContainer.style.left = '0';
  transitionContainer.style.width = '100vw';
  transitionContainer.style.height = '100vh';
  transitionContainer.style.pointerEvents = 'none';
  transitionContainer.style.zIndex = '999';
  transitionContainer.style.opacity = '0';
  transitionContainer.style.transition = 'opacity 0.5s ease';
  transitionContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
  document.body.appendChild(transitionContainer);
  
  // Créer des lignes de code pour la transition
  const codeLines = [];
  for (let i = 0; i < 20; i++) {
    codeLines.push(createCodeLine(transitionContainer, i));
  }
  
  // Curseur clignotant
  const cursor = document.createElement('div');
  cursor.className = 'code-cursor';
  cursor.style.position = 'absolute';
  cursor.style.width = '2px';
  cursor.style.height = '18px';
  cursor.style.backgroundColor = 'white';
  cursor.style.top = '50%';
  cursor.style.left = '50%';
  cursor.style.opacity = '0';
  cursor.style.animation = 'cursorBlink 1s infinite';
  transitionContainer.appendChild(cursor);
  
  // Ajouter le style d'animation pour le curseur
  const style = document.createElement('style');
  style.textContent = `
    @keyframes cursorBlink {
      0%, 49% { opacity: 1; }
      50%, 100% { opacity: 0; }
    }
  `;
  document.head.appendChild(style);
  
  // Sections du site
  const sections = [
    { id: 'home', name: 'Accueil' },
    { id: 'xp-pro', name: 'Expériences Pro' },
    { id: 'education', name: 'Formation' },
    { id: 'skills', name: 'Compétences' },
    { id: 'projects', name: 'Projets' },
    { id: 'soft-skills', name: 'Compétences personnelles' }
  ];
  
  // Trouver les sections existantes
  const existingSections = [];
  sections.forEach(section => {
    const element = document.getElementById(section.id);
    if (element) {
      existingSections.push({
        id: section.id,
        name: section.name,
        element: element
      });
    }
  });
  
  console.log('Sections trouvées:', existingSections.map(s => s.id).join(', '));
  
  // Transition active
  let isTransitionActive = false;
  let lastScrollPosition = 0;
  
  // Détecter le défilement
  window.addEventListener('scroll', function() {
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    
    // Détecter la transition entre les sections
    for (let i = 0; i < existingSections.length - 1; i++) {
      const currentSection = existingSections[i];
      const nextSection = existingSections[i + 1];
      
      if (!currentSection.element || !nextSection.element) continue;
      
      const currentRect = currentSection.element.getBoundingClientRect();
      const nextRect = nextSection.element.getBoundingClientRect();
      
      // Zone de transition: quand on approche de la fin de la section actuelle
      const transitionStart = -windowHeight * 0.2; // 20% avant la fin de la section
      const transitionEnd = -windowHeight * 0.8; // 80% avant la fin de la section
      
      // Si nous sommes dans la zone de transition
      if (currentRect.bottom < windowHeight && currentRect.bottom > 0 && nextRect.top < windowHeight) {
        const progress = 1 - (currentRect.bottom / windowHeight);
        
        if (progress > 0.3 && progress < 0.9) {
          // Activer la transition
          if (!isTransitionActive) {
            console.log(`Transition activée entre ${currentSection.name} et ${nextSection.name}`);
            isTransitionActive = true;
          }
          
          // Afficher la transition
          transitionContainer.style.opacity = Math.min(0.7, progress);
          
          // Animer les lignes de code
          codeLines.forEach((line, index) => {
            const delay = index * 0.05;
            const lineProgress = Math.max(0, Math.min(1, (progress * 2) - delay));
            
            // Opacité et position
            line.style.opacity = lineProgress;
            
            // Animation différente selon la position
            if (index % 2 === 0) {
              line.style.transform = `translateX(${(1 - lineProgress) * 30}px)`;
            } else {
              line.style.transform = `translateX(${(1 - lineProgress) * -30}px)`;
            }
            
            // Animer le texte
            const codeText = line.querySelector('.code-text');
            if (codeText) {
              const text = codeText.getAttribute('data-text') || '';
              const visibleLength = Math.floor(text.length * lineProgress);
              codeText.textContent = text.substring(0, visibleLength);
            }
          });
          
          // Animer le curseur
          cursor.style.opacity = progress > 0.5 ? '1' : '0';
          cursor.style.left = `${50 + (Math.sin(Date.now() / 1000) * 20)}%`;
          cursor.style.top = `${30 + (Math.cos(Date.now() / 1000) * 20)}%`;
        } else if (progress >= 0.9) {
          // Fin de la transition, masquer progressivement
          transitionContainer.style.opacity = Math.max(0, 0.7 - (progress - 0.9) * 7);
        }
      } else if (isTransitionActive && 
                ((currentRect.bottom <= 0 && nextRect.top <= 0) || 
                 (currentRect.top >= windowHeight && nextRect.top >= windowHeight))) {
        // Masquer la transition quand on est complètement sorti de la zone
        transitionContainer.style.opacity = '0';
        isTransitionActive = false;
      }
    }
    
    // Sauvegarder la position de défilement
    lastScrollPosition = scrollPosition;
  });
  
  // Fonction pour créer une ligne de code
  function createCodeLine(container, index) {
    const line = document.createElement('div');
    line.className = 'code-line';
    line.style.position = 'absolute';
    line.style.display = 'flex';
    line.style.alignItems = 'center';
    line.style.opacity = '0';
    line.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
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
    lineNumber.className = 'line-number';
    lineNumber.style.display = 'inline-block';
    lineNumber.style.minWidth = '30px';
    lineNumber.style.color = 'rgba(255, 255, 255, 0.5)';
    lineNumber.style.marginRight = '10px';
    lineNumber.style.textAlign = 'right';
    lineNumber.textContent = (index + 1).toString().padStart(2, '0');
    
    // Texte de code
    const codeText = document.createElement('span');
    codeText.className = 'code-text';
    codeText.style.color = 'white';
    codeText.style.fontWeight = '400';
    codeText.setAttribute('data-text', codeSnippets[index % codeSnippets.length]);
    
    // Curseur clignotant
    const codeCursor = document.createElement('span');
    codeCursor.className = 'cursor';
    codeCursor.style.display = 'inline-block';
    codeCursor.style.width = '2px';
    codeCursor.style.height = '14px';
    codeCursor.style.backgroundColor = 'white';
    codeCursor.style.marginLeft = '2px';
    codeCursor.style.opacity = '0';
    
    // Assembler la ligne
    line.appendChild(lineNumber);
    line.appendChild(codeText);
    line.appendChild(codeCursor);
    
    // Ajouter la ligne au conteneur
    container.appendChild(line);
    
    return line;
  }
});

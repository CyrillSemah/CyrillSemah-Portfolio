// Effet de lignes de code animées pour la transition entre les sections Compétences et Projets
document.addEventListener('DOMContentLoaded', function() {
  console.log('Script de transition Compétences-Projets chargé');
  
  // Création du conteneur pour l'effet de transition
  const transitionContainer = document.createElement('div');
  transitionContainer.className = 'code-transition skills-projects-transition';
  document.body.appendChild(transitionContainer);
  
  // Création du conteneur pour l'effet de révélation progressive
  const revealContainer = document.createElement('div');
  revealContainer.className = 'reveal-transition skills-projects-reveal';
  document.body.appendChild(revealContainer);
  
  // Création des éléments de révélation
  createRevealElements(revealContainer);
  
  // Lignes de code à afficher (extraits de code orientés projets)
  const codeSnippets = [
    'class SoftSkills {',
    '  constructor() {',
    '    this.communication = "Excellente";',
    '    this.teamwork = "Collaboratif";',
    '    this.problemSolving = "Analytique";',
    '    this.adaptability = "Flexible";',
    '  }',
    '}',
    '',
    'function evaluatePersonality() {',
    '  return {',
    '    strengths: ["Créativité", "Empathie", "Organisation"],',
    '    areas_to_improve: ["Patience", "Délégation"]',
    '  };',
    '}',
    '',
    '.personality-traits {',
    '  display: flex;',
    '  flex-wrap: wrap;',
    '  justify-content: space-between;',
    '}',
    '',
    '.trait-card {',
    '  background-color: rgba(43, 63, 138, 0.1);',
    '  border-radius: 10px;',
    '  padding: 15px;',
    '  margin: 10px;',
    '  flex: 1 0 200px;',
    '}',
    '',
    '<section class="soft-skills">',
    '  <h2>Compétences Personnelles</h2>',
    '  <div class="traits-container">',
    '    <div class="trait">Communication</div>',
    '    <div class="trait">Travail d\'équipe</div>',
    '  </div>',
    '</section>',
    '',
    'const personalValues = [',
    '  "Intégrité",',
    '  "Créativité",',
    '  "Excellence",',
    '  "Apprentissage continu",',
    '  "Respect"',
    '];',
    '',
    'function assessSoftSkills(person) {',
    '  let score = 0;',
    '  if (person.communication > 7) score += 10;',
    '  if (person.teamwork > 8) score += 15;',
    '  if (person.adaptability > 9) score += 20;',
    '  return score;',
    '}'
  ];
  
  // Création des lignes de code (gauche et droite)
  for (let i = 0; i < 15; i++) {
    // Lignes de code à gauche
    createCodeLine(transitionContainer, codeSnippets, i, 'left');
    
    // Lignes de code à droite
    createCodeLine(transitionContainer, codeSnippets, i + 15, 'right');
  }
  
  // Détection du défilement pour déclencher l'animation
  window.addEventListener('scroll', function() {
    const skillsSection = document.getElementById('skills');
    const projectsSection = document.getElementById('projects');
    
    if (!skillsSection || !projectsSection) {
      console.log('Sections non trouvées');
      return;
    }
    
    // Position des sections par rapport à la fenêtre
    const scrollPosition = window.scrollY;
    const skillsHeight = skillsSection.offsetHeight;
    const skillsTop = skillsSection.offsetTop;
    
    // Calcul de la distance totale entre les deux sections
    const totalDistance = skillsHeight;
    
    // Définir la zone de transition (jusqu'à 60% de la distance entre les sections)
    const transitionStart = skillsTop + totalDistance * 0.5; // Commencer à 50% de la section Compétences
    const transitionEnd = skillsTop + totalDistance * 0.9; // Terminer à 90% de la section Compétences
    
    // Si nous sommes dans la zone de transition
    if (scrollPosition >= transitionStart && scrollPosition <= transitionEnd) {
      // Calculer la progression (0 à 1)
      const progress = (scrollPosition - transitionStart) / (transitionEnd - transitionStart);
      
      console.log('Progression code Compétences-Projets:', progress);
      
      // Rendre le conteneur de code visible
      transitionContainer.style.opacity = Math.min(1, progress * 2);
      
      // Animer les lignes de code
      const codeLines = transitionContainer.querySelectorAll('.code-line');
      codeLines.forEach((line, index) => {
        // Délai d'apparition basé sur l'index
        const delay = index * 0.1;
        const lineProgress = Math.max(0, Math.min(1, (progress * 3) - delay));
        
        // Animer l'opacité et la position de chaque ligne
        line.style.opacity = lineProgress;
        
        // Animer la position en fonction de la classe (gauche ou droite)
        if (line.classList.contains('code-line-right')) {
          line.style.transform = `translateX(${(1 - lineProgress) * -50}px)`;
        } else {
          line.style.transform = `translateX(${(1 - lineProgress) * 50}px)`;
        }
        
        // Animer le curseur
        const cursor = line.querySelector('.cursor');
        if (cursor) {
          cursor.style.opacity = lineProgress > 0.8 ? 1 : 0;
        }
        
        // Animer le texte (révéler progressivement)
        const codeText = line.querySelector('.code-text');
        if (codeText) {
          const text = codeText.getAttribute('data-text') || '';
          const visibleLength = Math.floor(text.length * lineProgress);
          codeText.textContent = text.substring(0, visibleLength);
        }
      });
      
      // Animer les éléments de révélation progressive
      const revealElements = revealContainer.querySelectorAll('.reveal-element');
      revealContainer.style.opacity = '1'; // Toujours visible dans la zone de transition
      
      revealElements.forEach((element, index) => {
        // Progression personnalisée pour chaque élément (apparition plus rapide)
        const elementProgress = Math.max(0, Math.min(1, progress * 2 - (index * 0.02)));
        
        // Animer la taille et l'opacité (plus visible)
        element.style.transform = `scale(${0.8 + (elementProgress * 0.5)}) rotate(${elementProgress * 180}deg)`;
        element.style.opacity = elementProgress * 0.9;
      });
      
    } else {
      // En dehors de la zone de transition, masquer les effets
      transitionContainer.style.opacity = '0';
      revealContainer.style.opacity = '0';
    }
  });
});

// Fonction pour créer une ligne de code animée
function createCodeLine(container, snippets, index, position = 'left') {
  const line = document.createElement('div');
  line.className = 'code-line';
  
  // Position verticale aléatoire mais éviter les chevauchements
  const top = (Math.random() * 70) + 10; // Entre 10% et 80% de la hauteur
  line.style.top = top + '%';
  
  // Position horizontale en fonction du paramètre (gauche ou droite)
  if (position === 'left') {
    // Position à gauche
    const left = (Math.random() * 25) + 5; // Entre 5% et 30% de la largeur
    line.style.left = left + '%';
  } else {
    // Position à droite
    const right = (Math.random() * 25) + 5; // Entre 5% et 30% de la largeur depuis la droite
    line.style.right = right + '%';
    line.classList.add('code-line-right');
  }
  
  // Sélectionner un extrait de code aléatoire
  const snippetIndex = Math.floor(Math.random() * snippets.length);
  const snippet = snippets[snippetIndex];
  
  // Créer le numéro de ligne
  const lineNumber = document.createElement('span');
  lineNumber.className = 'line-number';
  lineNumber.textContent = (index + 1).toString().padStart(2, '0');
  
  // Créer le texte de code
  const codeText = document.createElement('span');
  codeText.className = 'code-text';
  codeText.setAttribute('data-text', snippet);
  
  // Créer le curseur clignotant
  const cursor = document.createElement('span');
  cursor.className = 'cursor';
  cursor.textContent = '|';
  
  // Assembler la ligne
  line.appendChild(lineNumber);
  line.appendChild(codeText);
  line.appendChild(cursor);
  
  // Ajouter la ligne au conteneur
  container.appendChild(line);
  
  return line;
}

// Fonction pour créer les éléments de révélation progressive
function createRevealElements(container) {
  // Types d'éléments à révéler (spécifiques aux soft skills)
  const elementTypes = [
    'circle', 'square', 'triangle', 'diamond', 'hexagon',
    'heart', 'star', 'chat', 'person', 'handshake',
    'dot', 'plus', 'minus', 'asterisk', 'equals'
  ];
  
  // Créer plusieurs éléments de révélation
  for (let i = 0; i < 20; i++) {
    const element = document.createElement('div');
    element.className = 'reveal-element';
    
    // Choisir un type d'élément aléatoire
    const typeIndex = Math.floor(Math.random() * elementTypes.length);
    element.classList.add(elementTypes[typeIndex]);
    
    // Position aléatoire
    element.style.top = (Math.random() * 100) + '%';
    element.style.left = (Math.random() * 100) + '%';
    
    // Taille aléatoire
    const size = (Math.random() * 30) + 10; // Entre 10px et 40px
    element.style.width = size + 'px';
    element.style.height = size + 'px';
    
    // Délai d'animation aléatoire
    element.style.animationDelay = (Math.random() * 2) + 's';
    
    // Ajouter l'élément au conteneur
    container.appendChild(element);
  }
};

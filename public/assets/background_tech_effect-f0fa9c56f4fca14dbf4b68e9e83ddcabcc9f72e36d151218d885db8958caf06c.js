// Animation dynamique pour l'arrière-plan technique
document.addEventListener('turbo:load', function() {
  console.log('turbo:load fired - initialisation des effets pour l\'arrière-plan technique');
  initializeBackgroundTechEffect();
});

document.addEventListener('DOMContentLoaded', function() {
  console.log('DOMContentLoaded fired - initialisation des effets pour l\'arrière-plan technique');
  initializeBackgroundTechEffect();
});

// Exécuter immédiatement pour être sûr
initializeBackgroundTechEffect();

function initializeBackgroundTechEffect() {
  console.log('Initialisation des effets pour l\'arrière-plan technique...');
  
  // Sélectionner le conteneur de l'arrière-plan
  const techBackground = document.querySelector('.tech-background');
  
  if (!techBackground) {
    console.log('L\'arrière-plan technique n\'a pas été trouvé');
    return;
  }
  
  console.log('Arrière-plan technique trouvé, création des éléments dynamiques');
  
  // Créer des éléments pour la gestion de projet
  createProjectManagementElements(techBackground);
  
  // Créer des éléments pour le développement web
  createWebDevelopmentElements(techBackground);
  
  // Créer des éléments pour le graphisme
  createGraphicDesignElements(techBackground);
  
  // Ajouter un effet de parallaxe au mouvement de la souris
  addMouseParallaxEffect(techBackground);
  
  console.log('Initialisation des effets pour l\'arrière-plan technique terminée');
}

// Fonction pour créer des éléments représentant la gestion de projet
function createProjectManagementElements(container) {
  // Créer un conteneur pour les éléments de gestion de projet
  const pmContainer = document.createElement('div');
  pmContainer.className = 'tech-background__pm-elements';
  container.appendChild(pmContainer);
  
  // Créer un diagramme de Gantt simplifié
  const ganttChart = document.createElement('div');
  ganttChart.className = 'tech-background__gantt';
  pmContainer.appendChild(ganttChart);
  
  // Ajouter des barres au diagramme de Gantt
  for (let i = 0; i < 5; i++) {
    const ganttBar = document.createElement('div');
    ganttBar.className = 'tech-background__gantt-bar';
    ganttBar.style.width = `${Math.random() * 30 + 20}%`;
    ganttBar.style.left = `${Math.random() * 20}%`;
    ganttBar.style.top = `${i * 20}%`;
    ganttBar.style.animationDelay = `${Math.random() * 5}s`;
    ganttChart.appendChild(ganttBar);
  }
  
  // Créer un graphique circulaire (camembert)
  const pieChart = document.createElement('div');
  pieChart.className = 'tech-background__pie-chart';
  pmContainer.appendChild(pieChart);
  
  // Ajouter des sections au camembert
  for (let i = 0; i < 4; i++) {
    const pieSection = document.createElement('div');
    pieSection.className = 'tech-background__pie-section';
    pieSection.style.transform = `rotate(${i * 90}deg)`;
    pieSection.style.animationDelay = `${i * 0.5}s`;
    pieChart.appendChild(pieSection);
  }
  
  // Animer le conteneur de gestion de projet
  animateRandomMovement(pmContainer, 30, 20);
}

// Fonction pour créer des éléments représentant le développement web
function createWebDevelopmentElements(container) {
  // Créer un conteneur pour les éléments de développement web
  const webContainer = document.createElement('div');
  webContainer.className = 'tech-background__web-elements';
  container.appendChild(webContainer);
  
  // Créer des balises HTML
  const htmlTags = ['<div>', '<span>', '<a>', '</html>', '<body>', '<h1>', '<p>', '</div>'];
  
  for (let i = 0; i < 8; i++) {
    const tag = document.createElement('div');
    tag.className = 'tech-background__html-tag';
    tag.textContent = htmlTags[i % htmlTags.length];
    tag.style.top = `${Math.random() * 80}%`;
    tag.style.left = `${Math.random() * 80}%`;
    tag.style.animationDelay = `${Math.random() * 5}s`;
    webContainer.appendChild(tag);
  }
  
  // Créer des symboles CSS
  const cssSymbols = ['{', '}', ';', ':', '#', '.', '@media', '@keyframes'];
  
  for (let i = 0; i < 8; i++) {
    const symbol = document.createElement('div');
    symbol.className = 'tech-background__css-symbol';
    symbol.textContent = cssSymbols[i % cssSymbols.length];
    symbol.style.top = `${Math.random() * 80}%`;
    symbol.style.left = `${Math.random() * 80}%`;
    symbol.style.animationDelay = `${Math.random() * 5}s`;
    webContainer.appendChild(symbol);
  }
  
  // Créer des symboles JavaScript
  const jsSymbols = ['function()', '=>', 'const', 'let', 'if', 'for', 'return', '{}'];
  
  for (let i = 0; i < 8; i++) {
    const symbol = document.createElement('div');
    symbol.className = 'tech-background__js-symbol';
    symbol.textContent = jsSymbols[i % jsSymbols.length];
    symbol.style.top = `${Math.random() * 80}%`;
    symbol.style.left = `${Math.random() * 80}%`;
    symbol.style.animationDelay = `${Math.random() * 5}s`;
    webContainer.appendChild(symbol);
  }
  
  // Animer le conteneur de développement web
  animateRandomMovement(webContainer, 40, 30);
}

// Fonction pour créer des éléments représentant le graphisme
function createGraphicDesignElements(container) {
  // Créer un conteneur pour les éléments de graphisme
  const graphicContainer = document.createElement('div');
  graphicContainer.className = 'tech-background__graphic-elements';
  container.appendChild(graphicContainer);
  
  // Créer des formes géométriques
  const shapes = ['circle', 'square', 'triangle', 'hexagon'];
  
  for (let i = 0; i < 12; i++) {
    const shape = document.createElement('div');
    shape.className = `tech-background__shape tech-background__shape--${shapes[i % shapes.length]}`;
    shape.style.top = `${Math.random() * 80}%`;
    shape.style.left = `${Math.random() * 80}%`;
    shape.style.animationDelay = `${Math.random() * 5}s`;
    shape.style.transform = `rotate(${Math.random() * 360}deg) scale(${Math.random() * 0.5 + 0.5})`;
    graphicContainer.appendChild(shape);
  }
  
  // Créer une palette de couleurs
  const colorPalette = document.createElement('div');
  colorPalette.className = 'tech-background__color-palette';
  graphicContainer.appendChild(colorPalette);
  
  // Ajouter des couleurs à la palette
  const colors = ['#FF5733', '#33FF57', '#3357FF', '#F3FF33', '#FF33F3'];
  
  for (let i = 0; i < 5; i++) {
    const colorSwatch = document.createElement('div');
    colorSwatch.className = 'tech-background__color-swatch';
    colorSwatch.style.backgroundColor = colors[i];
    colorSwatch.style.animationDelay = `${i * 0.3}s`;
    colorPalette.appendChild(colorSwatch);
  }
  
  // Animer le conteneur de graphisme
  animateRandomMovement(graphicContainer, 50, 40);
}

// Fonction pour animer un élément avec un mouvement aléatoire
function animateRandomMovement(element, maxX, maxY) {
  // Position initiale aléatoire
  element.style.top = `${Math.random() * 70}%`;
  element.style.left = `${Math.random() * 70}%`;
  
  // Fonction pour déplacer l'élément de manière aléatoire
  function moveRandomly() {
    // Calculer une nouvelle position aléatoire
    const newX = Math.random() * maxX - maxX / 2;
    const newY = Math.random() * maxY - maxY / 2;
    
    // Appliquer la nouvelle position avec une transition fluide
    element.style.transform = `translate(${newX}%, ${newY}%)`;
    
    // Planifier le prochain mouvement après un délai aléatoire
    setTimeout(moveRandomly, Math.random() * 5000 + 3000);
  }
  
  // Démarrer l'animation
  moveRandomly();
}

// Fonction pour ajouter un effet de parallaxe au mouvement de la souris
function addMouseParallaxEffect(container) {
  document.addEventListener('mousemove', function(e) {
    // Calculer la position relative de la souris sur la fenêtre (de -1 à 1)
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = (e.clientY / window.innerHeight) * 2 - 1;
    
    // Sélectionner tous les éléments à animer
    const elements = container.querySelectorAll('.tech-background__pm-elements, .tech-background__web-elements, .tech-background__graphic-elements');
    
    // Appliquer un effet de parallaxe à chaque élément
    elements.forEach((element, index) => {
      const depth = (index + 1) * 5; // Profondeur différente pour chaque élément
      element.style.transform = `translate(${x * depth}px, ${y * depth}px) ${element.style.transform || ''}`;
    });
    
    // Effet sur les lignes wireframe
    const wireframeLines = container.querySelectorAll('.tech-background__wireframe-wave-line');
    wireframeLines.forEach((line, index) => {
      const depth = index * 0.5;
      line.style.transform = `translateY(${y * depth * 10}px)`;
    });
    
    // Effet sur les points
    const dots = container.querySelectorAll('.tech-background__dot');
    dots.forEach((dot, index) => {
      if (index % 5 === 0) { // Appliquer seulement à certains points pour économiser les performances
        const depth = (index % 10) * 0.3;
        dot.style.transform = `translate(${x * depth * 15}px, ${y * depth * 15}px)`;
      }
    });
  });
};

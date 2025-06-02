// Transition entre les sections Expériences Pro et Formation
document.addEventListener('DOMContentLoaded', function() {
  console.log('Script de transition Formation chargé');
  
  // Création du conteneur pour l'effet de transition
  const transitionContainer = document.createElement('div');
  transitionContainer.className = 'formation-transition';
  document.body.appendChild(transitionContainer);
  
  // Création du titre de la section
  const titleContainer = document.createElement('div');
  titleContainer.className = 'formation-transition-title';
  titleContainer.innerHTML = `
    <div class="formation-title">Formation</div>
    <div class="formation-subtitle">Parcours éducatif</div>
  `;
  transitionContainer.appendChild(titleContainer);
  
  // Création des éléments de transition
  const elementsContainer = document.createElement('div');
  elementsContainer.className = 'formation-transition-elements';
  transitionContainer.appendChild(elementsContainer);
  
  // Création des éléments visuels
  const visualElements = [
    { type: 'diploma', label: 'Diplômes' },
    { type: 'skills', label: 'Compétences' },
    { type: 'certificate', label: 'Certifications' }
  ];
  
  visualElements.forEach((element, index) => {
    createVisualElement(elementsContainer, element, index);
  });
  
  // Création des lignes de connexion
  for (let i = 0; i < 10; i++) {
    const line = document.createElement('div');
    line.className = 'formation-transition-line';
    line.style.left = `${Math.random() * 100}%`;
    line.style.width = `${2 + Math.random() * 3}px`;
    line.style.height = '0';
    line.style.top = `${Math.random() * 100}%`;
    line.style.opacity = '0';
    line.style.backgroundColor = '#fff';
    transitionContainer.appendChild(line);
  }
  
  // Détection du défilement pour déclencher l'animation
  window.addEventListener('scroll', function() {
    const xpProSection = document.getElementById('xp-pro');
    const formationSection = document.getElementById('formation');
    
    if (!xpProSection || !formationSection) {
      console.log('Sections non trouvées');
      return;
    }
    
    // Position des sections par rapport à la fenêtre
    const scrollPosition = window.scrollY;
    const xpProHeight = xpProSection.offsetHeight;
    const xpProTop = xpProSection.offsetTop;
    
    // Définir la zone de transition
    const transitionStart = xpProTop + xpProHeight * 0.5; // Commencer à 50% de la section XP
    const transitionEnd = xpProTop + xpProHeight * 0.9; // Terminer à 90% de la section XP
    
    // Si nous sommes dans la zone de transition
    if (scrollPosition >= transitionStart && scrollPosition <= transitionEnd) {
      // Calculer la progression (0 à 1)
      const progress = (scrollPosition - transitionStart) / (transitionEnd - transitionStart);
      
      console.log('Progression transition formation:', progress);
      
      // Rendre le conteneur visible
      transitionContainer.style.opacity = Math.min(1, progress * 2);
      
      // Animer le titre
      titleContainer.style.transform = `translateY(${(1 - progress) * 50}px)`;
      titleContainer.style.opacity = Math.min(1, progress * 3);
      
      // Animer les éléments visuels
      const elements = elementsContainer.querySelectorAll('.formation-visual-element');
      elements.forEach((element, index) => {
        const delay = index * 0.1;
        const elementProgress = Math.max(0, Math.min(1, (progress * 2) - delay));
        
        element.style.transform = `translateY(${(1 - elementProgress) * 30}px) scale(${0.5 + (elementProgress * 0.5)})`;
        element.style.opacity = elementProgress;
        
        // Animer l'icône
        const icon = element.querySelector('.element-icon');
        if (icon) {
          icon.style.transform = `rotate(${elementProgress * 360}deg)`;
        }
      });
      
      // Animer les lignes
      const lines = transitionContainer.querySelectorAll('.formation-transition-line');
      lines.forEach((line, index) => {
        const delay = index * 0.05;
        const lineProgress = Math.max(0, Math.min(1, (progress * 2.5) - delay));
        
        line.style.height = `${lineProgress * 100}%`;
        line.style.opacity = lineProgress * 0.7;
      });
      
    } else {
      // En dehors de la zone de transition, masquer l'effet
      transitionContainer.style.opacity = '0';
    }
  });
  
  // Déclencher un événement de défilement initial pour initialiser l'état
  window.dispatchEvent(new Event('scroll'));
});

// Fonction pour créer un élément visuel
function createVisualElement(container, element, index) {
  const visualElement = document.createElement('div');
  visualElement.className = `formation-visual-element ${element.type}`;
  
  // Icône
  const icon = document.createElement('div');
  icon.className = 'element-icon';
  
  // Différentes icônes selon le type
  if (element.type === 'diploma') {
    icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M12 2a9 9 0 0 1 9 9v7.5a3.5 3.5 0 0 1-6.39 1.976a2.999 2.999 0 0 1-5.223 0a3.5 3.5 0 0 1-6.382-1.783L3 18.499V11a9 9 0 0 1 9-9zm0 2a7 7 0 0 0-6.996 6.76L5 11v7.446l.002.138a1.5 1.5 0 0 0 2.645.88l.088-.116a1 1 0 0 1 1.834.001a1.5 1.5 0 0 0 2.422.033L12 19.293l.01.09a1.5 1.5 0 0 0 2.422-.033a1 1 0 0 1 1.834-.001l.088.117a1.5 1.5 0 0 0 2.643-.881L19 18.5V11a7 7 0 0 0-7-7z" fill="#ffffff"/></svg>`;
  } else if (element.type === 'skills') {
    icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M12 14v2a6 6 0 0 0-6 6H4a8 8 0 0 1 8-8zm0-1c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6zm0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm9 6h1v5h-8v-5h1v-1a3 3 0 0 1 6 0v1zm-2 0v-1a1 1 0 0 0-2 0v1h2z" fill="#ffffff"/></svg>`;
  } else if (element.type === 'certificate') {
    icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M13 15.5V15H7v5h10v-5h-4zm-8-3h16V4H5v8.5zM3 14V2.992C3 2.455 3.447 2 3.998 2H20.001c.551 0 .999.449.999 1.007V14H3zm2 4v4h14v-4H5z" fill="#ffffff"/></svg>`;
  }
  
  visualElement.appendChild(icon);
  
  // Étiquette
  const label = document.createElement('div');
  label.className = 'element-label';
  label.textContent = element.label;
  visualElement.appendChild(label);
  
  // Position
  visualElement.style.left = `${20 + (index * 30)}%`;
  visualElement.style.top = `${40 + (index * 15)}%`;
  
  container.appendChild(visualElement);
};

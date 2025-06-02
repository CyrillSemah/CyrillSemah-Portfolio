// Effet de transition de livre animé entre les sections Expériences Pro et Formation
document.addEventListener('DOMContentLoaded', function() {
  console.log('Script de transition par livre animé chargé');
  
  // Création du conteneur pour l'effet de transition
  const bookTransitionContainer = document.createElement('div');
  bookTransitionContainer.className = 'book-transition';
  document.body.appendChild(bookTransitionContainer);
  
  // Création de la couverture du livre
  const bookCover = document.createElement('div');
  bookCover.className = 'book-cover';
  bookCover.innerHTML = `
    <div class="book-title">
      Formation
      <div class="book-subtitle">Le chemin vers l'expertise</div>
    </div>
  `;
  bookTransitionContainer.appendChild(bookCover);
  
  // Création des pages du livre (3 pages)
  const pageContents = [
    {
      title: "De l'expérience à l'apprentissage",
      text: "L'expérience professionnelle forge les compétences, mais la <span class='highlight'>formation</span> les structure et les enrichit.",
      listItems: [
        "Acquisition de connaissances théoriques",
        "Développement de compétences pratiques",
        "Certification des acquis professionnels"
      ],
      image: "chart",
      footer: "La formation continue est essentielle dans un monde en constante évolution."
    },
    {
      title: "Parcours éducatif",
      text: "Chaque <span class='highlight'>diplôme</span> représente une étape clé dans la construction d'une carrière solide.",
      listItems: [
        "Formations académiques reconnues",
        "Certifications professionnelles",
        "Apprentissage en autodidacte"
      ],
      image: "diploma",
      footer: "L'éducation est un investissement qui ne se déprécie jamais."
    },
    {
      title: "Compétences acquises",
      text: "Les <span class='highlight'>compétences</span> développées pendant la formation sont le fondement de l'expertise professionnelle.",
      listItems: [
        "Maîtrise des technologies et méthodologies",
        "Capacité d'analyse et de résolution de problèmes",
        "Adaptabilité et apprentissage continu"
      ],
      image: "skills",
      footer: "La formation est un processus continu tout au long de la carrière."
    }
  ];
  
  // Création des pages
  for (let i = 0; i < 3; i++) {
    createBookPage(bookTransitionContainer, pageContents[i], i);
  }
  
  // Création des particules flottantes
  createBookParticles(bookTransitionContainer);
  
  // Détection du défilement pour déclencher l'animation
  window.addEventListener('scroll', function() {
    const xpProSection = document.getElementById('xp-pro');
    const formationSection = document.getElementById('formation');
    
    if (!xpProSection || !formationSection) {
      console.log('Sections non trouvées');
      return;
    }
    
    // Position des sections par rapport à la fenêtre
    const windowHeight = window.innerHeight;
    const scrollPosition = window.scrollY;
    const xpProHeight = xpProSection.offsetHeight;
    const xpProTop = xpProSection.offsetTop;
    
    // Calcul de la distance totale entre les deux sections
    const totalDistance = xpProHeight;
    
    // Définir la zone de transition (jusqu'à 60% de la distance entre les sections)
    const transitionStart = xpProTop + totalDistance * 0.1; // Commencer à 10% de la distance
    const transitionEnd = xpProTop + totalDistance * 0.6; // Terminer à 60% de la distance
    
    // Si nous sommes dans la zone de transition (entre 10% et 60% de la distance)
    if (scrollPosition >= transitionStart && scrollPosition <= transitionEnd) {
      // Calculer la progression (0 à 1)
      const progress = (scrollPosition - transitionStart) / (transitionEnd - transitionStart);
      
      console.log('Progression livre:', progress);
      
      // Rendre le conteneur de livre visible
      bookTransitionContainer.style.opacity = Math.min(1, progress * 2);
      
      // Positionner le livre au centre de l'écran
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      // Animer la couverture du livre
      bookCover.style.top = `${centerY - (bookCover.offsetHeight / 2)}px`;
      bookCover.style.left = `${centerX - (bookCover.offsetWidth / 2)}px`;
      bookCover.style.transform = `translateX(${(1 - progress) * 100}px) rotateY(${progress * 90}deg)`;
      
      // Animer les pages du livre
      const bookPages = bookTransitionContainer.querySelectorAll('.book-page');
      bookPages.forEach((page, index) => {
        // Délai d'apparition basé sur l'index
        const delay = index * 0.2;
        const pageProgress = Math.max(0, Math.min(1, (progress * 3) - delay));
        
        // Positionner la page
        page.style.top = `${centerY - (page.offsetHeight / 2)}px`;
        page.style.left = `${centerX - (page.offsetWidth / 2)}px`;
        
        // Animer la rotation de la page
        page.style.transform = `translateX(${(1 - pageProgress) * 50}px) rotateY(${pageProgress * 180}deg)`;
        
        // Animer le contenu de la page
        const pageContent = page.querySelector('.page-content');
        if (pageContent) {
          pageContent.style.opacity = pageProgress;
        }
        
        // Animer le graphique si présent
        const chart = page.querySelector('.chart');
        if (chart) {
          const bars = chart.querySelectorAll('.bar');
          bars.forEach((bar, barIndex) => {
            const height = 20 + (barIndex * 10) + (Math.random() * 20);
            bar.style.height = `${height * pageProgress}%`;
          });
        }
      });
      
      // Animer les particules
      const particles = bookTransitionContainer.querySelectorAll('.book-particle');
      particles.forEach((particle, index) => {
        // Progression personnalisée pour chaque particule
        const particleProgress = Math.max(0, Math.min(1, progress * 2 - (index * 0.05)));
        
        // Animer l'opacité et la rotation
        particle.style.opacity = particleProgress * 0.8;
        particle.style.transform = `scale(${0.5 + (particleProgress * 0.5)}) rotate(${particleProgress * 360}deg)`;
      });
      
    } else {
      // En dehors de la zone de transition, masquer l'effet
      bookTransitionContainer.style.opacity = '0';
    }
  });
  
  // Déclencher un événement de défilement initial pour initialiser l'état
  window.dispatchEvent(new Event('scroll'));
});

// Fonction pour créer une page de livre
function createBookPage(container, content, index) {
  const page = document.createElement('div');
  page.className = 'book-page';
  page.style.zIndex = 10 - index; // Pages empilées
  
  // Contenu de la page (face avant)
  const pageContent = document.createElement('div');
  pageContent.className = 'page-content';
  
  // Titre
  const pageTitle = document.createElement('div');
  pageTitle.className = 'page-title';
  pageTitle.textContent = content.title;
  pageContent.appendChild(pageTitle);
  
  // Texte
  const pageText = document.createElement('div');
  pageText.className = 'page-text';
  pageText.innerHTML = content.text;
  pageContent.appendChild(pageText);
  
  // Liste
  if (content.listItems && content.listItems.length > 0) {
    const pageList = document.createElement('ul');
    pageList.className = 'page-list';
    
    content.listItems.forEach(item => {
      const listItem = document.createElement('li');
      listItem.textContent = item;
      pageList.appendChild(listItem);
    });
    
    pageContent.appendChild(pageList);
  }
  
  // Image ou graphique
  const pageImage = document.createElement('div');
  pageImage.className = 'page-image';
  
  if (content.image === 'chart') {
    // Créer un graphique à barres simple
    const chart = document.createElement('div');
    chart.className = 'chart';
    
    for (let i = 0; i < 5; i++) {
      const bar = document.createElement('div');
      bar.className = 'bar';
      bar.style.height = '0%'; // Hauteur initiale à 0
      chart.appendChild(bar);
    }
    
    pageImage.appendChild(chart);
  } else if (content.image === 'diploma') {
    // Image de diplôme
    const img = document.createElement('div');
    img.style.width = '60px';
    img.style.height = '60px';
    img.style.backgroundImage = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='none' d='M0 0h24v24H0z'/%3E%3Cpath d='M12 2a9 9 0 0 1 9 9v7.5a3.5 3.5 0 0 1-6.39 1.976a2.999 2.999 0 0 1-5.223 0a3.5 3.5 0 0 1-6.382-1.783L3 18.499V11a9 9 0 0 1 9-9zm0 2a7 7 0 0 0-6.996 6.76L5 11v7.446l.002.138a1.5 1.5 0 0 0 2.645.88l.088-.116a1 1 0 0 1 1.834.001a1.5 1.5 0 0 0 2.422.033L12 19.293l.01.09a1.5 1.5 0 0 0 2.422-.033a1 1 0 0 1 1.834-.001l.088.117a1.5 1.5 0 0 0 2.643-.881L19 18.5V11a7 7 0 0 0-7-7zm4 9a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h8zm0 2h-8v2h8v-2zm-7-6a1 1 0 1 1 0 2a1 1 0 0 1 0-2zm3 0a1 1 0 1 1 0 2a1 1 0 0 1 0-2zm3 0a1 1 0 1 1 0 2a1 1 0 0 1 0-2z' fill='rgba(43,63,138,1)'/%3E%3C/svg%3E\")";
    img.style.backgroundSize = 'contain';
    img.style.backgroundRepeat = 'no-repeat';
    img.style.backgroundPosition = 'center';
    pageImage.appendChild(img);
  } else if (content.image === 'skills') {
    // Image de compétences
    const skills = ['HTML', 'CSS', 'JS', 'PHP', 'SQL'];
    const skillsContainer = document.createElement('div');
    skillsContainer.style.display = 'flex';
    skillsContainer.style.flexWrap = 'wrap';
    skillsContainer.style.gap = '5px';
    skillsContainer.style.justifyContent = 'center';
    
    skills.forEach(skill => {
      const skillBadge = document.createElement('div');
      skillBadge.textContent = skill;
      skillBadge.style.padding = '3px 8px';
      skillBadge.style.backgroundColor = 'rgba(43,63,138,0.1)';
      skillBadge.style.color = '#2b3f8a';
      skillBadge.style.borderRadius = '3px';
      skillBadge.style.fontSize = '0.8rem';
      skillsContainer.appendChild(skillBadge);
    });
    
    pageImage.appendChild(skillsContainer);
  }
  
  pageContent.appendChild(pageImage);
  
  // Pied de page
  if (content.footer) {
    const pageFooter = document.createElement('div');
    pageFooter.className = 'page-footer';
    pageFooter.textContent = content.footer;
    pageContent.appendChild(pageFooter);
  }
  
  page.appendChild(pageContent);
  
  // Face arrière de la page
  const pageBack = document.createElement('div');
  pageBack.className = 'page-back';
  
  // Contenu simplifié pour la face arrière
  const backContent = document.createElement('div');
  backContent.className = 'page-content';
  backContent.innerHTML = `
    <div class="page-title">Notes</div>
    <div class="page-text">
      Cette page contient des notes personnelles sur le parcours de formation.
    </div>
  `;
  
  pageBack.appendChild(backContent);
  page.appendChild(pageBack);
  
  container.appendChild(page);
}

// Fonction pour créer des particules flottantes
function createBookParticles(container) {
  const particleTypes = ['formula', 'note', 'diploma'];
  const particleCount = 15;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = `book-particle ${particleTypes[i % particleTypes.length]}`;
    
    // Taille aléatoire
    const size = 20 + Math.random() * 30;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    // Position aléatoire
    const top = Math.random() * 80 + 10; // Entre 10% et 90% de la hauteur
    const left = Math.random() * 80 + 10; // Entre 10% et 90% de la largeur
    particle.style.top = `${top}%`;
    particle.style.left = `${left}%`;
    
    container.appendChild(particle);
  }
};

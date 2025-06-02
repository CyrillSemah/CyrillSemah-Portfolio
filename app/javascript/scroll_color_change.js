// Script pour gérer le changement de couleur de fond au scroll
document.addEventListener('DOMContentLoaded', () => {
  // Utilisation de console.info au lieu de console.log pour réduire la verbosité
  console.info('Script de changement de couleur progressif chargé');
  
  // Définition des couleurs pour chaque section
  const sectionColors = {
    'home': '#2b3f8a', // $color-blue
    'xp-pro': '#eeedec', // $color-light
    'education': '#c13733', // $color-red (section formation)
    'skills': '#202f66', // $color-dark
    'projets': '#eeedec' // $color-light
  };

  // Récupération des sections
  const sections = document.querySelectorAll('.section');
  const sectionsArray = Array.from(sections);
  let currentSection = '';
  let currentColor = sectionColors['home'];
  let targetColor = sectionColors['home'];
  
  // Réduction des logs pour éviter d'encombrer la console
  console.info('Sections détectées:', sections.length);
  
  // Suppression des couleurs de fond des sections pour éviter les délimitations
  sections.forEach(section => {
    section.style.backgroundColor = 'transparent';
  });
  
  // Définir la couleur initiale (section Accueil)
  document.body.style.backgroundColor = sectionColors['home'];
  document.body.style.color = '#eeedec';
  
  // Fonction pour convertir une couleur hex en RGB
  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }
  
  // Fonction pour mélanger deux couleurs selon un pourcentage
  function blendColors(color1, color2, percentage) {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    
    if (!rgb1 || !rgb2) return color1;
    
    const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * percentage);
    const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * percentage);
    const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * percentage);
    
    return `rgb(${r}, ${g}, ${b})`;
  }

  // Fonction pour calculer la position de scroll relative entre deux sections
  function getScrollProgress() {
    // Vérifier si nous sommes sur une page d'administration
    const isAdminPage = window.location.pathname.includes('/admin/');
    if (isAdminPage || sectionsArray.length === 0) {
      // Retourner des valeurs par défaut pour les pages d'administration
      return {
        currentId: 'home',
        nextId: 'home',
        progress: 0
      };
    }
    
    // Trouver l'index de la section actuelle et de la suivante
    const scrollPosition = window.scrollY + window.innerHeight / 2;
    let currentIndex = -1;
    let nextIndex = -1;
    
    for (let i = 0; i < sectionsArray.length; i++) {
      const section = sectionsArray[i];
      if (!section) continue; // Vérifier si la section existe
      
      const sectionTop = section.offsetTop || 0;
      const sectionHeight = section.offsetHeight || 0;
      const sectionBottom = sectionTop + sectionHeight;
      
      // Déterminer si nous sommes dans cette section
      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        currentIndex = i;
        nextIndex = Math.min(i + 1, sectionsArray.length - 1);
        break;
      }
    }
    
    // Si nous n'avons pas trouvé de section actuelle, utiliser la première
    if (currentIndex === -1) {
      currentIndex = 0;
      nextIndex = Math.min(1, sectionsArray.length - 1);
    }
    
    const currentSection = sectionsArray[currentIndex];
    const nextSection = sectionsArray[nextIndex];
    
    // Vérifier si les sections existent
    if (!currentSection || !nextSection) {
      return {
        currentId: 'home',
        nextId: 'home',
        progress: 0
      };
    }
    
    // Calculer le pourcentage de progression entre les deux sections
    const currentSectionTop = currentSection.offsetTop || 0;
    const currentSectionHeight = currentSection.offsetHeight || 0;
    const transitionStart = currentSectionTop + currentSectionHeight * 0.75; // Démarrer la transition à 75% de la section actuelle
    
    const nextSectionTop = nextSection.offsetTop || 0;
    const transitionDistance = nextSectionTop - transitionStart;
    
    // Si la distance de transition est trop petite, retourner 0 ou 1
    if (transitionDistance <= 0) {
      return {
        currentId: currentSection.id || 'home',
        nextId: nextSection.id || 'home',
        progress: currentIndex === nextIndex ? 0 : 1
      };
    }
    
    // Calculer le pourcentage de progression
    let progress = (scrollPosition - transitionStart) / transitionDistance;
    progress = Math.max(0, Math.min(1, progress)); // Limiter entre 0 et 1
    
    return {
      currentId: currentSection.id || 'home',
      nextId: nextSection.id || 'home',
      progress: progress
    };
  }

  // Fonction pour mettre à jour la couleur de fond en fonction du scroll
  function updateBackgroundColor() {
    // Vérifier si nous sommes sur une page d'administration
    const isAdminPage = window.location.pathname.includes('/admin/');
    if (isAdminPage) {
      // Ne pas appliquer les changements de couleur sur les pages d'administration
      return;
    }
    
    const scrollInfo = getScrollProgress();
    
    if (!scrollInfo) return;
    
    const { currentId, nextId, progress } = scrollInfo;
    
    // Mettre à jour les sections actuelles pour le débogage
    if (currentId !== currentSection) {
      // Réduire la verbosité des logs - utiliser une approche plus simple
      // Commenter les logs pour éviter d'encombrer la console
      // console.log('Section actuelle:', currentId, 'Section suivante:', nextId, 'Progression:', progress.toFixed(2));
      currentSection = currentId;
    }
    
    // Obtenir les couleurs des sections
    const fromColor = sectionColors[currentId] || sectionColors['home'];
    const toColor = sectionColors[nextId] || fromColor;
    
    // Mélanger les couleurs selon le pourcentage de progression
    const blendedColor = blendColors(fromColor, toColor, progress);
    document.body.style.backgroundColor = blendedColor;
    
    // Ajuster la couleur du texte en fonction de la couleur de fond
    const textColorLight = '#eeedec';
    const textColorDark = '#202f66';
    
    // Déterminer si nous passons d'un fond foncé à un fond clair ou l'inverse
    const isFromDark = fromColor !== '#eeedec';
    const isToDark = toColor !== '#eeedec';
    
    // Si les deux fonds sont de même type (clair ou foncé), pas besoin de transition de couleur
    if (isFromDark === isToDark) {
      document.body.style.color = isFromDark ? textColorLight : textColorDark;
    } else {
      // Transition progressive de la couleur du texte
      document.body.style.color = isFromDark ? 
        blendColors(textColorLight, textColorDark, progress) : 
        blendColors(textColorDark, textColorLight, progress);
    }
    
    // Mettre à jour les éléments spécifiques qui doivent changer de couleur
    try {
      updateElementColors(progress, isFromDark, isToDark);
    } catch (error) {
      // Capturer les erreurs potentielles sans bloquer l'exécution
      console.error('Erreur lors de la mise à jour des couleurs des éléments:', error.message);
    }
  }
  
  // Fonction pour mettre à jour les couleurs des éléments spécifiques
  function updateElementColors(progress, isFromDark, isToDark) {
    // Vérifier si nous sommes sur une page d'administration
    const isAdminPage = window.location.pathname.includes('/admin/');
    if (isAdminPage) {
      // Ne pas appliquer les changements de couleur sur les pages d'administration
      return;
    }
    
    // Couleurs de base
    const colorBlue = '#2b3f8a';
    const colorLight = '#eeedec';
    const colorDark = '#202f66';
    const colorRed = '#c13733';
    
    // Si les deux fonds sont de même type, pas besoin de changer les couleurs
    if (isFromDark === isToDark) return;
    
    try {
      // 1. Éléments de la section Accueil
      // Trait rouge sous la photo de profil
      const profileImageStyle = document.getElementById('profile-image-style');
      if (!profileImageStyle) {
        const style = document.createElement('style');
        style.id = 'profile-image-style';
        document.head.appendChild(style);
      }
      
      const imageStyleSheet = document.getElementById('profile-image-style');
      if (imageStyleSheet) {
        // Ajouter un observateur pour suivre la position de l'image et ajuster le trait
        imageStyleSheet.textContent = `
          .section-home__image {
            position: relative !important;
          }
        `;
      }
      
      // Vérifier si le trait rouge existe déjà
      let redLine = document.getElementById('red-line');
      
      // Si le trait n'existe pas et que nous sommes sur la page d'accueil, le créer
      const homeImage = document.querySelector('.section-home__image');
      if (homeImage && !redLine) {
        redLine = document.createElement('div');
        redLine.id = 'red-line';
        redLine.style.position = 'absolute';
        redLine.style.height = '2px';
        redLine.style.backgroundColor = colorRed;
        redLine.style.left = '59px'; // Décalage vers la droite
        redLine.style.right = '0'; // S'étend jusqu'au bord droit
        redLine.style.width = 'calc(100vw)'; // Force la largeur totale
        redLine.style.zIndex = '10';
        
        // Ajouter le trait à la page
        homeImage.appendChild(redLine);
        
        // Fonction pour positionner le trait au bas de l'image
        const updateLinePosition = () => {
          const img = homeImage.querySelector('img');
          if (img && redLine) {
            redLine.style.bottom = '0';
          }
        };
        
        // Mettre à jour la position initiale
        updateLinePosition();
        
        // Observer les changements de taille
        window.addEventListener('resize', updateLinePosition);
      }
      
      // Titre h1
      const homeTitle = document.querySelector('.section-home__text h1');
      if (homeTitle) {
        const fromTextColor = isFromDark ? colorLight : colorDark;
        const toTextColor = isFromDark ? colorDark : colorLight;
        homeTitle.style.color = blendColors(fromTextColor, toTextColor, progress);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour des éléments visuels:', error.message);
    }
    
    // Paragraphe
    const homeText = document.querySelector('.section-home__text p');
    if (homeText) {
      const fromTextColor = isFromDark ? colorLight : colorDark;
      const toTextColor = isFromDark ? colorDark : colorLight;
      homeText.style.color = blendColors(fromTextColor, toTextColor, progress);
    }
    
    // Bouton "Télécharger mon CV"
    const downloadButton = document.querySelector('.btn-download');
    if (downloadButton) {
      // Transition de couleur pour le fond du bouton
      const fromBgColor = isFromDark ? colorLight : colorBlue;
      const toBgColor = isFromDark ? colorBlue : colorLight;
      downloadButton.style.backgroundColor = blendColors(fromBgColor, toBgColor, progress);
      
      // Transition de couleur pour le texte du bouton
      const fromTextColor = isFromDark ? colorBlue : colorLight;
      const toTextColor = isFromDark ? colorLight : colorBlue;
      downloadButton.style.color = blendColors(fromTextColor, toTextColor, progress);
    }
    
    // Bouton "Let's Talk" - Garder la couleur claire ($color-light) pendant toute la transition
    const talkButton = document.querySelector('.btn-talk');
    if (talkButton) {
      talkButton.style.color = colorLight;
    }
    
    // 2. Éléments de la section XP Pro
    // Titre h2
    const experienceTitle = document.querySelector('.section-experience__header h2');
    if (experienceTitle) {
      // Maintenir le fond du titre en $color-blue
      experienceTitle.style.backgroundColor = colorBlue;
      
      // Couleur du texte du titre en $color-light
      experienceTitle.style.color = colorLight;
      
      // Transition pour la ligne sous le titre (::after)
      const titleStyle = document.getElementById('title-after-style');
      if (!titleStyle) {
        const style = document.createElement('style');
        style.id = 'title-after-style';
        document.head.appendChild(style);
      }
      
      const titleStyleSheet = document.getElementById('title-after-style');
      if (titleStyleSheet) {
        // Trait rouge sous le titre sans trait vertical de connexion
        titleStyleSheet.textContent = `
          /* Trait horizontal sous le titre */
          .section-experience__header h2::after { 
            background-color: ${colorRed} !important; 
          }
        `;
      }
    }
    
    // 3. Ligne verticale de la timeline
    const timelineElement = document.querySelector('.section-experience__timeline');
    if (timelineElement) {
      // Appliquer un style personnalisé pour le pseudo-élément ::before
      const timelineStyle = document.getElementById('timeline-style');
      if (!timelineStyle) {
        const style = document.createElement('style');
        style.id = 'timeline-style';
        document.head.appendChild(style);
      }
      
      const styleSheet = document.getElementById('timeline-style');
      if (styleSheet) {
        // Trait vertical de la timeline en rouge avec dégradé transparent
        styleSheet.textContent = `
          /* Trait vertical principal */
          .section-experience__timeline::before { 
            content: '' !important;
            position: absolute !important;
            width: 2px !important;
            top: -50px !important;
            bottom: 0 !important;
            left: 15px !important;
            z-index: 1 !important;
            background: linear-gradient(
              to bottom,
              transparent 0%,
              ${colorRed} 300px,
              ${colorRed} calc(100% - 300px),
              transparent 100%
            ) !important;
          }
          
          /* Forcer la même position en mode desktop */
          @media (min-width: 768px) {
            .section-experience__timeline::before {
              left: 15px !important;
              transform: none !important;
            }
          }
        `;
      }
    }
    
    // 4. Contenu des expériences professionnelles - Texte en $color-dark
    const experienceContent = document.querySelectorAll('.section-experience__content p, .section-experience__content h3, .company-card__header');
    experienceContent.forEach(element => {
      element.style.color = colorDark;
    });
    
    // 5. Ajouter un point sur la timeline uniquement en mode mobile
    const timelinePointStyle = document.getElementById('timeline-point-style');
    if (!timelinePointStyle) {
      const style = document.createElement('style');
      style.id = 'timeline-point-style';
      document.head.appendChild(style);
    }
    
    const pointStyleSheet = document.getElementById('timeline-point-style');
    if (pointStyleSheet) {
      // Ajouter un point sur la timeline pour chaque élément experience-item
      // Visible uniquement en mode mobile (max-width: 767px)
      pointStyleSheet.textContent = `
        /* Style pour le conteneur de la timeline pour éviter les débordements */
        .section-experience__timeline {
          overflow: visible !important;
          padding-left: 40px !important;
        }
        
        .company-card, .company-card__body, .experience-item {
          overflow: visible !important;
        }
        
        /* Points sur la timeline - visible sur tous les écrans */
        .experience-item {
          position: relative !important;
        }
        
        .experience-item::before {
          content: '' !important;
          position: absolute !important;
          left: -34px !important; /* Position ajustée pour centrer sur le trait */
          top: 26px !important;
          width: 16px !important;
          height: 16px !important;
          background-color: ${colorBlue} !important;
          border: 2px solid ${colorLight} !important;
          border-radius: 50% !important;
          z-index: 10 !important; /* Z-index élevé pour s'assurer qu'il est au-dessus */
        }
        
        /* Forcer la même position des points en mode desktop */
        @media (min-width: 768px) {
          .experience-item::before {
            left: -24px !important;
          }
        }
      `;
    }
  }

  // Écouter l'événement de défilement
  window.addEventListener('scroll', () => {
    requestAnimationFrame(updateBackgroundColor);
  });

  // Appliquer la couleur initiale après un court délai
  setTimeout(() => {
    updateBackgroundColor();
  }, 300);
  
  // Mettre à jour la couleur initiale
  updateBackgroundColor();
});

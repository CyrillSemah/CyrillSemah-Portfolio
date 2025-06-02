// Transition simple entre les sections Expériences Pro et Formation
document.addEventListener('DOMContentLoaded', function() {
  console.log('Script de transition Formation simplifié chargé');
  
  // Création d'un élément de transition directement visible
  const transitionElement = document.createElement('div');
  transitionElement.className = 'formation-transition-fixed';
  transitionElement.innerHTML = `
    <div class="formation-transition-content">
      <div class="formation-title">Formation</div>
      <div class="formation-icons">
        <div class="formation-icon diploma"></div>
        <div class="formation-icon skills"></div>
        <div class="formation-icon certificate"></div>
      </div>
    </div>
  `;
  document.body.appendChild(transitionElement);
  
  // Trouver les sections
  const xpProSection = document.getElementById('xp-pro');
  const educationSection = document.getElementById('education');
  
  if (xpProSection && educationSection) {
    // Insérer l'élément de transition après la section XP Pro
    xpProSection.after(transitionElement);
    
    // Ajouter des styles directement à l'élément pour garantir sa visibilité
    transitionElement.style.display = 'flex';
    transitionElement.style.justifyContent = 'center';
    transitionElement.style.alignItems = 'center';
    transitionElement.style.height = '200px';
    transitionElement.style.width = '100%';
    transitionElement.style.backgroundColor = '#2b3f8a';
    transitionElement.style.color = 'white';
    transitionElement.style.position = 'relative';
    transitionElement.style.overflow = 'hidden';
    transitionElement.style.zIndex = '10';
    
    // Styles pour le contenu
    const content = transitionElement.querySelector('.formation-transition-content');
    if (content) {
      content.style.textAlign = 'center';
      content.style.padding = '20px';
    }
    
    // Styles pour le titre
    const title = transitionElement.querySelector('.formation-title');
    if (title) {
      title.style.fontSize = '2.5rem';
      title.style.fontWeight = 'bold';
      title.style.marginBottom = '20px';
      title.style.textTransform = 'uppercase';
      title.style.letterSpacing = '2px';
    }
    
    // Styles pour les icônes
    const icons = transitionElement.querySelector('.formation-icons');
    if (icons) {
      icons.style.display = 'flex';
      icons.style.justifyContent = 'center';
      icons.style.gap = '30px';
    }
    
    // Styles pour chaque icône
    const iconElements = transitionElement.querySelectorAll('.formation-icon');
    iconElements.forEach((icon, index) => {
      icon.style.width = '60px';
      icon.style.height = '60px';
      icon.style.backgroundColor = 'white';
      icon.style.borderRadius = '50%';
      icon.style.display = 'flex';
      icon.style.justifyContent = 'center';
      icon.style.alignItems = 'center';
      icon.style.position = 'relative';
      
      // Ajouter un contenu à chaque icône
      if (icon.classList.contains('diploma')) {
        icon.textContent = 'D';
      } else if (icon.classList.contains('skills')) {
        icon.textContent = 'S';
      } else if (icon.classList.contains('certificate')) {
        icon.textContent = 'C';
      }
      
      // Style du texte
      icon.style.color = '#2b3f8a';
      icon.style.fontWeight = 'bold';
      icon.style.fontSize = '1.5rem';
    });
    
    // Ajouter des lignes décoratives
    for (let i = 0; i < 10; i++) {
      const line = document.createElement('div');
      line.className = 'formation-line';
      line.style.position = 'absolute';
      line.style.top = '0';
      line.style.left = `${Math.random() * 100}%`;
      line.style.width = '1px';
      line.style.height = '100%';
      line.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
      transitionElement.appendChild(line);
    }
    
    console.log('Transition fixe ajoutée entre XP Pro et Formation');
  } else {
    console.error('Sections XP Pro ou Education non trouvées');
  }
});

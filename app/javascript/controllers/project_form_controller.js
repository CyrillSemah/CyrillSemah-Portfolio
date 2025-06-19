import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = [
    "visualType",
    "displayType",
    "visualImages",
    "beforeImageGroup",
    "afterImageGroup",
    "imageGroup",
    "imageReplacer"
  ];

  // Helpers
  hideEl(el) {
    if (el) {
      el.classList.add("d-none");
      el.style.display = "none";
      console.log('Élément masqué:', el.id || el.className);
    }
  }
  
  showEl(el) {
    if (el) {
      el.classList.remove("d-none");
      el.style.display = "block";
      console.log('Élément affiché:', el.id || el.className);
    }
  }

  connect() {
    console.log("Project form controller connected");
    console.log("Targets disponibles:", {
      visualType: this.hasVisualTypeTarget,
      imageGroup: this.hasImageGroupTarget,
      beforeImageGroup: this.hasBeforeImageGroupTarget,
      afterImageGroup: this.hasAfterImageGroupTarget
    });
    
    // Initialisation immédiate
    this.initializeFields();
  }

  // ----------------------------------
  // Initialisation des champs visuels
  // ----------------------------------
  initializeFields() {
    console.log("Initialisation des champs");
    
    // Vérifier si nous avons un champ de type visuel
    if (this.hasVisualTypeTarget) {
      // Appliquer directement la logique basée sur la valeur actuelle
      const currentType = this.visualTypeTarget.value;
      console.log(`Type visuel initial: ${currentType}`);
      
      // Appliquer la logique selon la valeur actuelle (même si vide)
      this.applyVisualTypeLogic(currentType);
    } else {
      console.warn("Pas de cible visualType trouvée");
    }
  }

  // ----------------------------------
  // Sélecteur Type de visuel
  // ----------------------------------
  toggleVisualType(event) {
    console.log("toggleVisualType appelé avec", event.target.value);
    
    // Appliquer la logique selon le type sélectionné
    this.applyVisualTypeLogic(event.target.value);
  }
  
  applyVisualTypeLogic(type) {
    console.log(`applyVisualTypeLogic avec type: ${type}`);
    
    // Vérifier si nous avons les cibles nécessaires
    const hasImageGroup = this.hasImageGroupTarget;
    const hasBeforeAfterGroups = this.hasBeforeImageGroupTarget && this.hasAfterImageGroupTarget;
    
    console.log("Cibles disponibles:", {
      imageGroup: hasImageGroup,
      beforeImageGroup: this.hasBeforeImageGroupTarget,
      afterImageGroup: this.hasAfterImageGroupTarget
    });
    
    // Si aucun type sélectionné ou type vide, masquer tous les champs
    if (!type || type === "" || type === "Sélectionner le type de visuel") {
      console.log("Aucun type sélectionné, masquage de tous les champs");
      
      if (hasImageGroup) {
        this.hideEl(this.imageGroupTarget);
      }
      if (hasBeforeAfterGroups) {
        this.hideEl(this.beforeImageGroupTarget);
        this.hideEl(this.afterImageGroupTarget);
      }
      
    } else if (type.includes("single") || type === "single") {
      console.log("Mode SINGLE activé");
      
      // Masquer les groupes before/after s'ils existent
      if (hasBeforeAfterGroups) {
        this.hideEl(this.beforeImageGroupTarget);
        this.hideEl(this.afterImageGroupTarget);
      }
      
      // Afficher le groupe image s'il existe
      if (hasImageGroup) {
        this.showEl(this.imageGroupTarget);
      }
      
    } else if ((type.includes("before") && type.includes("after")) || type === "before_after" || type.toLowerCase() == 'before after') {
      console.log("Mode BEFORE_AFTER activé");
      
      // Masquer le groupe image s'il existe
      if (hasImageGroup) {
        this.hideEl(this.imageGroupTarget);
      }
      
      // Afficher les groupes before/after s'ils existent
      if (hasBeforeAfterGroups) {
        this.showEl(this.beforeImageGroupTarget);
        this.showEl(this.afterImageGroupTarget);
        
        // Remettre les classes col-md-6 pour afficher côte à côte
        this.beforeImageGroupTarget.className = this.beforeImageGroupTarget.className.replace(/col-md-\d+/g, '');
        this.beforeImageGroupTarget.classList.add('col-md-6');
        
        this.afterImageGroupTarget.className = this.afterImageGroupTarget.className.replace(/col-md-\d+/g, '');
        this.afterImageGroupTarget.classList.add('col-md-6');
      }
      
    } else {
      console.log("Type non reconnu:", type);
      
      // Masquer tous les champs pour les types non reconnus
      if (hasImageGroup) {
        this.hideEl(this.imageGroupTarget);
      }
      if (hasBeforeAfterGroups) {
        this.hideEl(this.beforeImageGroupTarget);
        this.hideEl(this.afterImageGroupTarget);
      }
    }
  }

  // ----------------------------------
  // Gestion des remplacements d'images
  // ----------------------------------
  setupImageReplacers() {
    console.log("Configuration des remplacements d'images");
    document.querySelectorAll(".btn-modify-image").forEach((button) => {
      const attachmentId = button.dataset.attachmentId;
      const projectId = button.dataset.projectId;

      button.addEventListener("click", (event) => {
        event.preventDefault();
        this.modifyDevelopmentImage(event);
      });
    });
  }

  modifyDevelopmentImage(event) {
    event.preventDefault();
    const button = event.currentTarget;
    const attachmentId = button.dataset.attachmentId;
    const fileInput = document.getElementById(`image-replacer-${attachmentId}`);
    if (fileInput) fileInput.click();
  }
}
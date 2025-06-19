import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["select", "otherFields", "companyNameField", "companyLogoField", "logoPreview"]

  connect() {
    // Débug pour voir si le contrôleur est bien connecté
    console.log("CompanySelector connect");
    console.log("Select value:", this.selectTarget.value);
    console.log("Has otherFields target:", this.hasOtherFieldsTarget);
    
    // Appliquer l'état initial
    this.toggleOtherFields();
    
    // Ajout d'un événement sur le sélecteur pour s'assurer que ça fonctionne
    this.selectTarget.addEventListener('change', () => this.toggleOtherFields());
  }

  toggleOtherFields() {
    const selectedValue = this.selectTarget.value;
    console.log("toggleOtherFields - Valeur sélectionnée:", selectedValue);
    
    // Vérification spécifique pour l'option "Autre"
    const isOtherSelected = selectedValue === "Autre";
    console.log("isOtherSelected:", isOtherSelected);
    
    if (this.hasOtherFieldsTarget) {
      // Afficher ou masquer les champs "Autre"
      if (isOtherSelected) {
        this.otherFieldsTarget.style.display = "block";
        console.log("Affichage des champs 'Autre'");
      } else {
        this.otherFieldsTarget.style.display = "none";
        console.log("Masquage des champs 'Autre'");
      }
      
      // Gérer les champs requis
      if (this.hasCompanyNameFieldTarget) {
        if (isOtherSelected) {
          this.companyNameFieldTarget.setAttribute("required", "required");
        } else {
          this.companyNameFieldTarget.removeAttribute("required");
        }
      }
      
      // Gérer la prévisualisation du logo
      if (!isOtherSelected && selectedValue && selectedValue !== "") {
        this.loadCompanyLogo(selectedValue);
      } else if (this.hasLogoPreviewTarget) {
        this.logoPreviewTarget.innerHTML = "";
        this.logoPreviewTarget.style.display = "none";
      }
    } else {
      console.error("Cible otherFields non trouvée");
    }
  }
  
  loadCompanyLogo(companyId) {
    if (companyId) {
      fetch(`/admin/professional_experiences/${companyId}/logo`)
        .then(response => response.json())
        .then(data => {
          if (data.logo_url && this.hasLogoPreviewTarget) {
            this.logoPreviewTarget.innerHTML = `
              <div class="current-image mb-3">
                <img src="${data.logo_url}" alt="Logo entreprise" style="max-width: 150px; max-height: 100px;">
                <p class="text-muted">Logo de l'entreprise sélectionnée</p>
              </div>
            `;
            this.logoPreviewTarget.style.display = "block";
          }
        })
        .catch(error => console.error("Erreur lors du chargement du logo:", error));
    }
  }
}

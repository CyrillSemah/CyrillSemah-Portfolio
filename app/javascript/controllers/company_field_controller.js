import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["input", "checkbox"]

  connect() {
    // Vérifier si le champ est déjà sur "Autre" lors de l'initialisation
    this.checkOther();
  }

  toggleOther() {
    if (this.checkboxTarget.checked) {
      // Si "Autre" est coché, effacer le champ et mettre "Autre"
      this.inputTarget.value = "Autre";
      this.inputTarget.setAttribute("readonly", true);
    } else {
      // Si "Autre" est décoché, rendre le champ éditable et vider s'il contient "Autre"
      this.inputTarget.removeAttribute("readonly");
      if (this.inputTarget.value === "Autre") {
        this.inputTarget.value = "";
      }
      this.inputTarget.focus();
    }
  }

  checkOther() {
    // Vérifier si la valeur actuelle est "Autre" et cocher la case si c'est le cas
    if (this.inputTarget.value === "Autre") {
      this.checkboxTarget.checked = true;
      this.inputTarget.setAttribute("readonly", true);
    } else {
      this.checkboxTarget.checked = false;
      this.inputTarget.removeAttribute("readonly");
    }
  }
}

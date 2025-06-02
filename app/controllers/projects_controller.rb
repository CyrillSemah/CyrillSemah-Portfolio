class ProjectsController < ApplicationController
  def index
    @projects = Project.ordered
    
    respond_to do |format|
      format.html # Rendu normal pour les requêtes HTML standard
      format.js   # Rendu pour les requêtes AJAX
    end
  end

  def show
    @project = Project.find(params[:id])
    
    respond_to do |format|
      format.html # Rendu normal pour les requêtes HTML standard
      format.js   # Rendu pour les requêtes AJAX
    end
  rescue ActiveRecord::RecordNotFound
    redirect_to projets_path, alert: "Projet non trouvé"
  end
end

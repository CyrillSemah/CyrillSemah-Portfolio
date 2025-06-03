class Admin::ProjectsController < Admin::BaseController
  before_action :set_project, only: [:show, :edit, :update, :destroy]
  
  def index
    @projects = Project.ordered
  end

  def choose_type
    # Page intermédiaire pour choisir le type de projet
  end

  def new
    @project = Project.new
    @project.project_type = params[:project_type] if params[:project_type].present?
    
    # Si c'est un projet de type retouche_creation, on prépare un visuel vide
    if @project.retouche_creation?
      @project.project_visuals.build
    end
  end

  def create
    @project = Project.new(project_params)
    
    # Assurons-nous que le type de projet est correctement défini
    if params[:project] && params[:project][:project_type].present?
      @project.project_type = params[:project][:project_type]
    end
    
    if @project.save
      if @project.retouche_creation? && (!params[:project][:project_visuals_attributes] || params[:project][:project_visuals_attributes].blank?)
        # Rediriger vers l'édition pour ajouter des visuels si c'est un projet de retouche
        redirect_to edit_admin_project_path(@project), notice: 'Projet créé avec succès. Ajoutez maintenant des visuels.'
      else
        redirect_to admin_projects_path, notice: 'Projet créé avec succès.'
      end
    else
      # Reconstruire les visuels si nécessaire
      @project.project_visuals.build if @project.retouche_creation? && @project.project_visuals.empty?
      render :new, status: :unprocessable_entity
    end
  end

  def edit
    # S'assurer qu'il y a au moins un visuel pour les projets de retouche
    if @project.retouche_creation? && @project.project_visuals.empty?
      @project.project_visuals.build
    end
  end

  def update
    if @project.update(project_params)
      redirect_to admin_projects_path, notice: 'Projet mis à jour avec succès.'
    else
      render :edit
    end
  end

  def show
    # Afficher les détails d'un projet spécifique
  end

  def destroy
    begin
      if @project.destroy
        redirect_to admin_projects_path, notice: 'Projet supprimé avec succès.'
      else
        redirect_to admin_projects_path, alert: 'Impossible de supprimer ce projet: ' + @project.errors.full_messages.join(', ')
      end
    rescue => e
      redirect_to admin_projects_path, alert: "Erreur lors de la suppression du projet: #{e.message}"
    end
  end
  
  # Ajouter un visuel à un projet existant (AJAX)
  def add_visual
    @project = Project.find(params[:id])
    
    # Vérifier que c'est bien un projet de type retouche_creation
    unless @project.retouche_creation?
      redirect_to edit_admin_project_path(@project), alert: "Impossible d'ajouter un visuel à un projet de type #{@project.project_type}"
      return
    end
    
    # Déterminer la position du nouveau visuel
    position = @project.project_visuals.maximum(:position).to_i + 1
    @visual = @project.project_visuals.build(position: position)
    
    respond_to do |format|
      format.turbo_stream
      format.html { redirect_to edit_admin_project_path(@project) }
    end
  end
  
  private
  
  def set_project
    @project = Project.find(params[:id])
  end
  
  def project_params
    # Paramètres de base pour tous les projets
    base_params = [:title, :description, :technologies, :position, :project_type]
    
    # Paramètres spécifiques selon le type de projet
    project_type = params[:project] && params[:project][:project_type]
    
    case project_type
    when 'development'
      base_params += [:github_url, :live_url, :image, development_images: []]
    when 'retouche_creation'
      base_params += [project_visuals_attributes: [:id, :description, :position, :display_type, :visual_type, :company, :before_image, :after_image, :_destroy]]
    end
    
    # Assurons-nous que tous les paramètres sont inclus, quel que soit le type
    # Cela évite les erreurs lors du changement de type de projet
    all_params = params.require(:project).permit(base_params)
    
    # Log pour débogage
    Rails.logger.debug "Project params: #{all_params.inspect}"
    
    all_params
  end
  
  def authenticate_admin!
    redirect_to root_path unless admin?
  end
end

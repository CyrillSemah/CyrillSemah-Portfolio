class Admin::ProjectsController < Admin::BaseController
  before_action :set_project, only: [:show, :edit, :update, :destroy, :add_visual, :delete_development_image, :replace_development_image] 
  
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

  def delete_development_image
    # @project est défini par set_project via before_action
    # params[:image_id] sera l'ID de l'ActiveStorage::Attachment
    attachment = @project.development_images_attachments.find_by(id: params[:image_id])

    if attachment
      attachment.purge # Supprime l'image et l'enregistrement d'attachement
      render json: { success: true, message: 'Image supprimée avec succès.', attachment_id: attachment.id }, status: :ok
    else
      render json: { success: false, message: "Image non trouvée ou déjà supprimée." }, status: :not_found
    end
  rescue ActiveRecord::RecordNotFound # Au cas où @project ne serait pas trouvé (set_project devrait le gérer)
    render json: { success: false, message: "Projet non trouvé." }, status: :not_found
  rescue => e # Capturer d'autres erreurs potentielles
    Rails.logger.error "Erreur lors de la suppression de l'image (attachment ID: #{params[:image_id]}) pour le projet #{@project&.id}: #{e.message}"
    render json: { success: false, message: "Erreur serveur lors de la suppression de l'image." }, status: :internal_server_error
  end
  
  def replace_development_image
    # Log de débogage pour le début de l'action
    Rails.logger.debug "Début de replace_development_image avec image_id=#{params[:image_id]}"
    Rails.logger.debug "Paramètres reçus: #{params.to_unsafe_h.except('controller', 'action').inspect}"
    
    # Vérifier la présence du fichier image
    if !params[:development_image]
      Rails.logger.error "Erreur: Aucune image fournie pour le remplacement"
      render json: { success: false, message: "Aucune image fournie pour le remplacement." }, status: :bad_request
      return
    end
    
    # Vérifier que le fichier est bien une image
    begin
      content_type = params[:development_image].content_type
      Rails.logger.debug "Type de contenu de l'image: #{content_type}"
      unless content_type.start_with?('image/')
        Rails.logger.error "Erreur: Format de fichier invalide: #{content_type}"
        render json: { success: false, message: "Format de fichier invalide. Seules les images sont acceptées." }, status: :unprocessable_entity
        return
      end
    rescue => e
      Rails.logger.error "Erreur lors de la vérification du type de fichier: #{e.message}"
    end
    
    # Trouver l'attachement existant
    attachment = @project.development_images_attachments.find_by(id: params[:image_id])
    
    if !attachment
      Rails.logger.error "Erreur: Image avec ID #{params[:image_id]} non trouvée"
      render json: { success: false, message: "Image non trouvée." }, status: :not_found
      return
    end
    
    begin
      # Mémoriser l'ID de l'ancien attachement pour le retourner dans la réponse
      attachment_id = attachment.id
      Rails.logger.debug "Ancien attachment ID: #{attachment_id}"
      
      # D'abord attacher la nouvelle image avant de supprimer l'ancienne
      # pour éviter de perdre toutes les images en cas d'erreur
      new_attachment = nil
      ActiveRecord::Base.transaction do
        # Créer un nouvel attachement avec la nouvelle image
        @project.development_images.attach(params[:development_image])
        
        # Récupérer le nouvel attachement pour générer l'URL
        new_attachment = @project.development_images_attachments.last
        
        # Une fois que la nouvelle image est attachée avec succès, purger l'ancienne
        attachment.purge
        
        Rails.logger.debug "Nouvelle image attachée avec succès, ID: #{new_attachment.id}"
      end
      
      # Générer l'URL miniature de la nouvelle image pour l'affichage
      begin
        variant = new_attachment.blob.variant(resize_to_limit: [150, 100]).processed
        # Utiliser rails_representation_path au lieu de rails_representation_url avec only_path: true
        image_url = Rails.application.routes.url_helpers.rails_representation_path(variant)
        
        # Générer l'URL complète de l'image pour la prévisualisation
        # Utiliser rails_blob_path au lieu de rails_blob_url
        image_full_url = Rails.application.routes.url_helpers.rails_blob_path(new_attachment.blob)
        
        Rails.logger.debug "URLs générées avec succès:\nURL miniature: #{image_url}\nURL complète: #{image_full_url}"
      rescue => e
        Rails.logger.error "Erreur lors de la génération des URLs: #{e.message}\n#{e.backtrace.join("\n")}"
        # Générer des URLs simples comme solution de secours
        image_url = "/rails/active_storage/blobs/redirect/#{new_attachment.blob.signed_id}"
        image_full_url = image_url
      end
      
      Rails.logger.debug "Remplacement réussi: old_id=#{attachment_id}, new_id=#{new_attachment.id}"
      Rails.logger.debug "URL générée: #{image_url}"
      
      render json: { 
        success: true, 
        message: "Image remplacée avec succès.", 
        new_attachment_id: new_attachment.id, 
        attachment_id: attachment_id,
        new_attachment_id: new_attachment.id,
        image_url: image_url,
        image_full_url: image_full_url
      }, status: :ok
    rescue => e
      Rails.logger.error "Erreur lors du remplacement de l'image (attachment ID: #{params[:image_id]}) pour le projet #{@project&.id}: #{e.message}"
      render json: { success: false, message: "Erreur serveur lors du remplacement de l'image: #{e.message}" }, status: :internal_server_error
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
    # Récupérer le type de projet actuel ou celui soumis dans les paramètres
    current_project_type = @project&.project_type || params.dig(:project, :project_type)

    
    case current_project_type
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

  # def authenticate_admin!
  #   redirect_to root_path unless admin?
  # end
  
  def authenticate_admin! # Assurez-vous que cette méthode est correctement définie si elle est utilisée comme before_action ailleurs.
    redirect_to root_path unless admin?
  end
end

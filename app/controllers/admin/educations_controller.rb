class Admin::EducationsController < Admin::BaseController
  before_action :set_education, only: [:show, :edit, :update, :destroy]
  
  def index
    # Afficher les formations dans l'ordre chronologique, indépendamment de leurs IDs
    @educations = Education.ordered_by_date
    
    # Stocker les IDs des formations existantes dans la session pour la navigation
    session[:education_ids] = @educations.pluck(:id)
  end
  
  def show
  end
  
  def new
    @education = Education.new
  end
  
  def create
    # Afficher les paramètres reçus pour le débogage
    Rails.logger.debug "Paramètres reçus : #{params.inspect}"
    Rails.logger.debug "Paramètres filtrés : #{education_params.inspect}"
    
    @education = Education.create_with_lowest_available_id(education_params)
    
    if @education.persisted?
      redirect_to admin_educations_path, notice: "La formation a été créée avec succès."
    else
      # Afficher les erreurs pour le débogage
      Rails.logger.debug "Erreurs : #{@education.errors.full_messages.inspect}"
      render :new, status: :unprocessable_entity
    end
  end
  
  def edit
  end
  
  def update
    if @education.update(education_params)
      redirect_to admin_educations_path, notice: "La formation a été mise à jour avec succès."
    else
      render :edit, status: :unprocessable_entity
    end
  end
  
  def destroy
    begin
      # Vérifier si l'enregistrement existe encore
      education = Education.find_by(id: params[:id])
      
      if education
        # Stocker l'ID de la formation supprimée pour éviter les doubles suppressions
        education_id = education.id
        
        # Marquer cette formation comme étant en cours de suppression
        session[:deleting_education_id] = education_id
        
        if education.destroy
          # Mettre à jour la liste des IDs de formations dans la session
          session[:education_ids] = session[:education_ids].reject { |id| id == education_id } if session[:education_ids].present?
          
          # Supprimer le marqueur de suppression
          session.delete(:deleting_education_id)
          
          respond_to do |format|
            format.html { redirect_to admin_educations_path, notice: "La formation a été supprimée avec succès." }
            format.json { render json: { success: true }, status: :ok }
          end
        else
          # Supprimer le marqueur de suppression en cas d'échec
          session.delete(:deleting_education_id)
          
          respond_to do |format|
            format.html { redirect_to admin_educations_path, alert: "Impossible de supprimer cette formation." }
            format.json { render json: { error: "Impossible de supprimer cette formation." }, status: :unprocessable_entity }
          end
        end
      else
        # Vérifier si cette formation est déjà en cours de suppression
        if session[:deleting_education_id].to_i == params[:id].to_i
          # Suppression déjà en cours, ne rien faire
          respond_to do |format|
            format.html { redirect_to admin_educations_path }
            format.json { render json: { success: true, message: "Suppression en cours" }, status: :ok }
          end
        else
          # L'enregistrement n'existe pas ou a déjà été supprimé
          respond_to do |format|
            format.html { redirect_to admin_educations_path, notice: "La formation demandée n'existe pas ou a déjà été supprimée." }
            format.json { render json: { success: true, message: "Déjà supprimé" }, status: :ok }
          end
        end
      end
    rescue => e
      # Supprimer le marqueur de suppression en cas d'erreur
      session.delete(:deleting_education_id)
      
      Rails.logger.error("Erreur lors de la suppression de la formation: #{e.message}")
      respond_to do |format|
        format.html { redirect_to admin_educations_path, alert: "Une erreur est survenue lors de la suppression." }
        format.json { render json: { error: "Une erreur est survenue lors de la suppression." }, status: :internal_server_error }
      end
    end
  end
  
  private
  
  def set_education
    @education = Education.find_by(id: params[:id])
    
    # Rediriger si l'enregistrement n'existe pas
    if @education.nil? && !request.xhr?
      redirect_to admin_educations_path, alert: "La formation demandée n'existe pas ou a déjà été supprimée."
    end
  end
  
  def education_params
    params.require(:education).permit(
      :school,
      :degree,
      :field_of_study,
      :start_month,
      :start_year,
      :end_month,
      :end_year,
      :activities,
      :description,
      :image,
      :image_1,
      :image_2,
      :diploma_id,
      :diploma_url
    )
  end
end

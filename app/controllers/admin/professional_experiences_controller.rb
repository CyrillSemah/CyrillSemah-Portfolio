class Admin::ProfessionalExperiencesController < Admin::BaseController
  before_action :set_professional_experience, only: [:show, :edit, :update, :destroy, :logo]
  
  def index
    @professional_experiences = ProfessionalExperience.ordered_by_date
  end
  
  def show
  end
  
  def new
    @professional_experience = ProfessionalExperience.new
  end
  
  def create
    @professional_experience = ProfessionalExperience.create_with_lowest_available_id(professional_experience_params)
    
    if @professional_experience.persisted?
      redirect_to admin_professional_experiences_path, notice: "L'expérience professionnelle a été créée avec succès."
    else
      render :new, status: :unprocessable_entity
    end
  end
  
  def edit
  end
  
  def update
    if @professional_experience.update(professional_experience_params)
      redirect_to admin_professional_experiences_path, notice: "L'expérience professionnelle a été mise à jour avec succès."
    else
      render :edit, status: :unprocessable_entity
    end
  end
  
  def destroy
    begin
      # Trouver tous les project_visuals qui référencent cette expérience professionnelle
      project_visuals = ProjectVisual.where(professional_experience_id: @professional_experience.id)
      
      # Supprimer la référence à l'expérience professionnelle dans ces project_visuals
      project_visuals.update_all(professional_experience_id: nil) if project_visuals.any?
      
      # Maintenant on peut supprimer l'expérience professionnelle
      if @professional_experience.destroy
        redirect_to admin_professional_experiences_path, notice: "L'expérience professionnelle a été supprimée avec succès."
      else
        redirect_to admin_professional_experiences_path, alert: "Erreur lors de la suppression de l'expérience professionnelle."
      end
    rescue => e
      redirect_to admin_professional_experiences_path, alert: "Erreur lors de la suppression: #{e.message}"
    end
  end
  
  # Endpoint pour récupérer le logo d'une entreprise
  def logo
    if @professional_experience.logo.attached?
      logo_url = rails_blob_path(@professional_experience.logo, only_path: true)
      render json: { success: true, logo_url: logo_url, company_name: @professional_experience.company_name }
    else
      render json: { success: false, message: "Aucun logo disponible pour cette entreprise" }
    end
  end
  
  private
  
  def set_professional_experience
    @professional_experience = ProfessionalExperience.find(params[:id])
  end
  
  def professional_experience_params
    params.require(:professional_experience).permit(
      :company_name,
      :job_title,
      :employment_type,
      :currently_working_here,
      :start_date,
      :end_date,
      :location,
      :workplace_type,
      :description,
      :logo
    )
  end

end

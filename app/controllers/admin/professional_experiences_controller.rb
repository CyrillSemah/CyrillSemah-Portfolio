class Admin::ProfessionalExperiencesController < ApplicationController
  before_action :authenticate_admin!
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
    @professional_experience.destroy
    redirect_to admin_professional_experiences_path, notice: "L'expérience professionnelle a été supprimée avec succès."
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

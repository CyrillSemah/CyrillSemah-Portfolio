class Admin::HomeSectionsController < Admin::BaseController
  before_action :set_home_section, only: [:show, :edit, :update, :destroy, :activate]
  
  def index
    @home_sections = HomeSection.all
    @active_section = HomeSection.active
  end

  def show
  end

  def new
    @home_section = HomeSection.new
    @home_section.build_home_image
  end

  def create
    @home_section = HomeSection.new(home_section_params)
    
    if @home_section.save
      if params[:activate] == "1"
        @home_section.activate!
      end
      redirect_to admin_home_sections_path, notice: 'Section d\'accueil créée avec succès.'
    else
      render :new
    end
  end

  def edit
    @home_section.build_home_image unless @home_section.home_image
  end

  def update
    if @home_section.update(home_section_params)
      if params[:activate] == "1"
        @home_section.activate!
      end
      redirect_to admin_home_sections_path, notice: 'Section d\'accueil mise à jour avec succès.'
    else
      render :edit
    end
  end

  def destroy
    @home_section.destroy
    redirect_to admin_home_sections_path, notice: 'Section d\'accueil supprimée avec succès.'
  end
  
  # Permet l'activation via GET ou POST
  def activate
    @home_section.activate!
    redirect_to admin_home_sections_path, notice: 'Section d\'accueil activée avec succès.'
  end
  
  private
  
  def set_home_section
    @home_section = HomeSection.find(params[:id])
  end
  
  def home_section_params
    params.require(:home_section).permit(
      :title, :subtitle, :cv_link, :talk_button_text, :download_button_text,
      :cv_file, :remove_cv_file,
      home_image_attributes: [:id, :image, :_destroy]
    )
  end
end

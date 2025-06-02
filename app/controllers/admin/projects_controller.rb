class Admin::ProjectsController < Admin::BaseController
  before_action :set_project, only: [:edit, :update, :destroy]
  
  def index
    @projects = Project.ordered
  end

  def new
    @project = Project.new
  end

  def create
    @project = Project.new(project_params)
    
    if @project.save
      redirect_to admin_projects_path, notice: 'Projet créé avec succès.'
    else
      render :new
    end
  end

  def edit
  end

  def update
    if @project.update(project_params)
      redirect_to admin_projects_path, notice: 'Projet mis à jour avec succès.'
    else
      render :edit
    end
  end

  def destroy
    @project.destroy
    redirect_to admin_projects_path, notice: 'Projet supprimé avec succès.'
  end
  
  private
  
  def set_project
    @project = Project.find(params[:id])
  end
  
  def project_params
    params.require(:project).permit(:title, :description, :technologies, :github_url, :live_url, :position, :image)
  end
  
  def authenticate_admin!
    redirect_to root_path unless admin?
  end
end

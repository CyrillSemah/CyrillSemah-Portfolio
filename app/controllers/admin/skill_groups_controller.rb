class Admin::SkillGroupsController < ApplicationController
  before_action :authenticate_admin!
  before_action :set_skill_group, only: [:show, :edit, :update, :destroy]
  
  def index
    @skill_groups = SkillGroup.all.includes(:skills)
  end

  def new
    @skill_group = SkillGroup.new
    @skill_groups = SkillGroup.all.includes(:skills)
  end

  def create
    # Utiliser la méthode du modèle pour créer avec l'ID disponible le plus bas
    @skill_group = SkillGroup.create_with_lowest_available_id(skill_group_params)
    
    if @skill_group.persisted?
      redirect_to admin_skills_path, notice: 'Groupe de compétences créé avec succès.'
    else
      @skill_groups = SkillGroup.all.includes(:skills)
      render :new
    end
  end

  def edit
    @skill_groups = SkillGroup.all.includes(:skills)
  end

  def update
    if @skill_group.update(skill_group_params)
      redirect_to admin_skills_path, notice: 'Groupe de compétences mis à jour avec succès.'
    else
      render :edit
    end
  end

  def destroy
    @skill_group.destroy
    redirect_to admin_skills_path, notice: 'Groupe de compétences supprimé avec succès.'
  end

  def show
    @skills = @skill_group.skills.ordered_by_name
  end
  
  def sort
    params[:order].each_with_index do |id, index|
      SkillGroup.where(id: id).update_all(position: index + 1)
    end
    
    head :ok
  end
  
  private
  
  def set_skill_group
    @skill_group = SkillGroup.find(params[:id])
  end
  
  def skill_group_params
    params.require(:skill_group).permit(:name, :description)
  end
  

end

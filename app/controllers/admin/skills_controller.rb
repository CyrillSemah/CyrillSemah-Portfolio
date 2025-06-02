class Admin::SkillsController < ApplicationController
  before_action :authenticate_admin!
  before_action :set_skill, only: [:show, :edit, :update, :destroy]
  
  def index
    @skill_groups = SkillGroup.all.includes(:skills)
    @ungrouped_skills = Skill.where(skill_group_id: nil).ordered_by_name
    @soft_skills = SoftSkill.ordered_by_name
  end
  
  def show
  end
  
  def new
    @skill = Skill.new
    @skill_groups = SkillGroup.all
    
    # Pré-remplir le groupe de compétences si fourni dans l'URL
    if params[:skill_group_id].present?
      @skill.skill_group_id = params[:skill_group_id]
      @from_group = true
    end
  end
  
  def create
    @skill = Skill.create_with_lowest_available_id(skill_params)
    
    if @skill.persisted?
      redirect_to admin_skills_path, notice: "La compétence a été créée avec succès."
    else
      @skill_groups = SkillGroup.all
      render :new, status: :unprocessable_entity
    end
  end
  
  def edit
    @skill_groups = SkillGroup.all
  end
  
  def update
    if @skill.update(skill_params)
      redirect_to admin_skills_path, notice: "La compétence a été mise à jour avec succès."
    else
      render :edit, status: :unprocessable_entity
    end
  end
  
  def destroy
    @skill.destroy
    redirect_to admin_skills_path, notice: "La compétence a été supprimée avec succès."
  end
  
  private
  
  def set_skill
    @skill = Skill.find(params[:id])
  end
  
  def skill_params
    params.require(:skill).permit(
      :name,
      :start_date,
      :description,
      :logo,
      :skill_group_id
    )
  end
end

class Admin::SoftSkillsController < ApplicationController
  before_action :authenticate_admin!
  before_action :set_soft_skill, only: [:show, :edit, :update, :destroy]
  
  def index
    # Redirection vers l'index des skills qui affiche également les soft skills
    redirect_to admin_skills_path
  end
  
  def show
  end
  
  def new
    @soft_skill = SoftSkill.new
  end
  
  def create
    @soft_skill = SoftSkill.create_with_lowest_available_id(soft_skill_params)
    
    if @soft_skill.persisted?
      redirect_to admin_skills_path, notice: "La compétence personnelle a été créée avec succès."
    else
      render :new, status: :unprocessable_entity
    end
  end
  
  def edit
  end
  
  def update
    if @soft_skill.update(soft_skill_params)
      redirect_to admin_skills_path, notice: "La compétence personnelle a été mise à jour avec succès."
    else
      render :edit, status: :unprocessable_entity
    end
  end
  
  def destroy
    @soft_skill.destroy
    redirect_to admin_skills_path, notice: "La compétence personnelle a été supprimée avec succès."
  end
  
  private
  
  def set_soft_skill
    @soft_skill = SoftSkill.find(params[:id])
  end
  
  def soft_skill_params
    params.require(:soft_skill).permit(:name)
  end
end

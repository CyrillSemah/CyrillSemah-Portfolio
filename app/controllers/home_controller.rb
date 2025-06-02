class HomeController < ApplicationController
  def index
    # Charger la section d'accueil active
    @home_section = HomeSection.active
    @home_image = @home_section&.home_image
    
    # Charger les expériences professionnelles
    @professional_experiences = ProfessionalExperience.ordered_by_date
    @grouped_experiences = @professional_experiences.group_by(&:company_name)
    
    # Charger les formations
    @educations = Education.ordered_by_date
    @grouped_educations = @educations.group_by(&:school)
    
    # Charger les compétences
    @skill_groups = SkillGroup.includes(:skills).all
    @ungrouped_skills = Skill.where(skill_group_id: nil).ordered_by_name
    
    # Charger les soft skills
    @soft_skills = SoftSkill.ordered_by_name
    
    # Charger les projets pour la section projets intégrée
    @projects = Project.ordered
  end
end

class Skill < ApplicationRecord
  include SequentialId
  belongs_to :skill_group, optional: true
  has_one_attached :logo
  
  validates :name, :start_date, :description, presence: true
  
  scope :ordered_by_name, -> { order(name: :asc) }
  scope :by_group, -> { includes(:skill_group).order('skill_groups.position ASC, skills.name ASC') }
  
  # Méthode pour calculer l'expérience en années et mois
  def experience_duration
    start = start_date
    today = Date.today
    
    years = today.year - start.year
    months = today.month - start.month
    
    if months < 0
      years -= 1
      months += 12
    end
    
    if years > 0 && months > 0
      "#{years} an#{years > 1 ? 's' : ''} et #{months} mois"
    elsif years > 0
      "#{years} an#{years > 1 ? 's' : ''}"
    else
      "#{months} mois"
    end
  end
end

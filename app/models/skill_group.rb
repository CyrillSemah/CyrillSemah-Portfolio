class SkillGroup < ApplicationRecord
  include SequentialId
  
  has_many :skills, dependent: :destroy
  
  validates :name, presence: true
  
  default_scope { order(position: :asc) }
  
  before_create :set_position
  
  private
  
  def set_position
    self.position ||= (SkillGroup.maximum(:position) || 0) + 1
  end
end

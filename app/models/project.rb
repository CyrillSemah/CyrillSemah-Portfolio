class Project < ApplicationRecord
  has_one_attached :image
  
  validates :title, presence: true
  validates :description, presence: true
  validates :technologies, presence: true
  
  scope :ordered, -> { order(position: :asc) }
  
  before_create :set_position
  
  private
  
  def set_position
    self.position = Project.maximum(:position).to_i + 1
  end
end

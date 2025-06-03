class ProjectVisual < ApplicationRecord
  belongs_to :project
  has_one_attached :before_image
  has_one_attached :after_image
  
  # Enum pour les types d'affichage
  enum :display_type, {
    standard: 'standard',
    slider: 'slider',
    side_by_side: 'side_by_side'
  }, default: 'standard'
  
  # Enum pour les types de visuels
  enum :visual_type, {
    single: 'single',
    before_after: 'before_after'
  }, default: 'single'
  
  # Validations
  validates :display_type, presence: true
  validates :visual_type, presence: true
  validates :position, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  
  # Validations conditionnelles
  with_options if: :before_after? do |ba|
    ba.validates :before_image, presence: true
    ba.validates :after_image, presence: true
  end
  
  with_options if: :single? do |s|
    s.validates :after_image, presence: true
  end
  
  # Scopes
  scope :ordered, -> { order(position: :asc) }
  
  # Méthodes d'instance
  def before_after?
    visual_type == 'before_after'
  end
  
  def single?
    visual_type == 'single'
  end
  
  # Callback pour définir la position par défaut
  before_validation :set_default_position, on: :create
  
  private
  
  def set_default_position
    return if position.present?
    
    max_position = project.project_visuals.maximum(:position) || -1
    self.position = max_position + 1
  end
end

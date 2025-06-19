class Project < ApplicationRecord
  has_one_attached :image
  has_many :project_visuals, dependent: :destroy
  has_many_attached :development_images
  
  # Constantes pour les types de projets
  DEVELOPMENT = 'development'
  RETOUCHE_CREATION = 'retouche_creation'
  
  # Validations du type de projet
  validates :project_type, inclusion: { in: [DEVELOPMENT, RETOUCHE_CREATION] }
  
  # Validations communes
  validates :title, presence: true
  validates :description, presence: true
  validates :technologies, presence: true
  validates :project_type, presence: true
  
  # Validations conditionnelles
  with_options if: :development? do |dev|
    dev.validates :image, presence: true, unless: -> { development_images.attached? }
  end
  
  with_options if: :retouche_creation? do |ret|
    ret.validates :project_visuals, presence: true, unless: -> { new_record? }
  end
  
  # Scopes
  scope :ordered, -> { order(position: :asc) }
  scope :development_projects, -> { where(project_type: DEVELOPMENT) }
  scope :retouche_creation_projects, -> { where(project_type: RETOUCHE_CREATION) }
  
  # Callbacks
  before_create :set_position
  
  # Méthodes d'instance
  def development?
    project_type == DEVELOPMENT
  end
  
  def retouche_creation?
    project_type == RETOUCHE_CREATION
  end
  
  # Accepte les attributs imbriqués pour les visuels de projet
  accepts_nested_attributes_for :project_visuals, allow_destroy: true, reject_if: :all_blank
  
  private
  
  def set_position
    self.position = Project.maximum(:position).to_i + 1
  end
end

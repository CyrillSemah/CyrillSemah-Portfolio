class ProjectVisual < ApplicationRecord
  belongs_to :project
  belongs_to :professional_experience, optional: true
  has_one_attached :image       # Pour type 'single'
  has_one_attached :before_image # Pour type 'before_after'
  has_one_attached :after_image  # Pour type 'before_after'
  has_one_attached :company_logo
  
  # Constantes pour les types d'affichage
  DISPLAY_TYPE_STANDARD = 'standard'
  DISPLAY_TYPE_SLIDER = 'slider'
  DISPLAY_TYPE_SIDE_BY_SIDE = 'side_by_side'
  DISPLAY_TYPES = [DISPLAY_TYPE_STANDARD, DISPLAY_TYPE_SLIDER, DISPLAY_TYPE_SIDE_BY_SIDE]
  
  # Constantes pour les types de visuels
  VISUAL_TYPE_SINGLE = 'single'
  VISUAL_TYPE_BEFORE_AFTER = 'before_after'
  VISUAL_TYPES = [VISUAL_TYPE_SINGLE, VISUAL_TYPE_BEFORE_AFTER]
  
  # Validations des types
  validates :display_type, inclusion: { in: DISPLAY_TYPES }
  validates :visual_type, inclusion: { in: VISUAL_TYPES }
  
  # Validations
  validates :display_type, presence: true
  validates :visual_type, presence: true
  validates :position, presence: true,
                       numericality: { only_integer: true, greater_than_or_equal_to: 0 }

  # Validation des images selon le type de visuel
  # --- Cas "single" : seulement image requis, before_image et after_image doivent être nil
  validates :image,
            presence: { message: "est requis pour un visuel simple" },
            if: :single?
            
  validate :ensure_single_image_only, if: :single?
  
  # --- Cas "before_after" : before_image ET after_image requis, image doit être nil
  with_options if: :before_after? do
    validates :before_image,
              presence: { message: "est requis pour un visuel avant/après" }
    validates :after_image,
              presence: { message: "est requis pour un visuel avant/après" }
    validate :ensure_before_after_images_only
  end
  
  # Méthodes d'aide pour les vues et validations
  def single?
    visual_type == VISUAL_TYPE_SINGLE
  end
  
  def before_after?
    visual_type == VISUAL_TYPE_BEFORE_AFTER
  end
  
  private
  
  def ensure_single_image_only
    # On ne vérifie pas cette contrainte lors d'une mise à jour
    # car les images before/after peuvent être présentes d'une précédente configuration
    # La validation sera faite lors de la prochaine sauvegarde complète
    return if persisted? && visual_type_changed?
    
    if before_image.attached? || after_image.attached?
      errors.add(:base, "En mode 'single', seul le champ 'image' doit être utilisé")
    end
  end
  
  def ensure_before_after_images_only
    # On ne vérifie pas si image est attachée lors d'un changement de type
    # Cela permet de passer de single à before_after sans erreur
    # La validation sera faite lors de la prochaine sauvegarde complète
  end
  
  # Scopes
  scope :ordered, -> { order(position: :asc) }
  
  # Méthodes d'instance
  def before_after?
    visual_type == VISUAL_TYPE_BEFORE_AFTER
  end
  
  def single?
    visual_type == VISUAL_TYPE_SINGLE
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

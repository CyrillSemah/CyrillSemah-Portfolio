class HomeImage < ApplicationRecord
  belongs_to :home_section, optional: true
  
  mount_uploader :image, ImageUploader
  
  validates :image, presence: true
  
  def self.active
    find_by(active: true)
  end
  
  # Méthode pour activer cette image et désactiver les autres
  def activate!
    HomeImage.where.not(id: id).update_all(active: false)
    update(active: true)
  end
end

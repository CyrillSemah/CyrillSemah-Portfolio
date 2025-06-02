class HomeSection < ApplicationRecord
  has_one :home_image, dependent: :destroy
  accepts_nested_attributes_for :home_image, allow_destroy: true
  
  mount_uploader :cv_file, FileUploader
  
  validates :title, presence: true
  validates :subtitle, presence: true
  
  # Réinitialiser la séquence d'ID après chaque suppression
  after_destroy :reset_id_sequence
  
  def self.active
    find_by(active: true)
  end
  
  # Méthode pour activer cette section et désactiver les autres
  def activate!
    HomeSection.where.not(id: id).update_all(active: false)
    update(active: true)
  end
  
  private
  
  # Réinitialise la séquence d'ID pour que les nouveaux enregistrements commencent à 1
  def reset_id_sequence
    ActiveRecord::Base.connection.reset_pk_sequence!(self.class.table_name)
  end
end

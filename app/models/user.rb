class User < ApplicationRecord
  # Validations
  validates :provider, :uid, presence: true
  validates :email, presence: true, uniqueness: true
  
  # Méthode de classe pour trouver ou créer un utilisateur à partir des données OAuth
  def self.from_omniauth(auth)
    where(provider: auth.provider, uid: auth.uid).first_or_create do |user|
      user.email = auth.info.email
      user.name = auth.info.name
    end
  end
  
  # Vérifie si l'utilisateur est l'administrateur
  def admin?
    email == "cyrillsemah@gmail.com"
  end
end

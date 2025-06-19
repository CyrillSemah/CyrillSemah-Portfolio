class AdminUser < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable,
         :recoverable, :rememberable, :trackable, :validatable
         
  # Désactiver la possibilité de s'inscrire (registerable)
  # Un seul admin est nécessaire
  
  # Validation de l'email de secours (optionnel)
  validates :backup_email, format: { with: Devise.email_regexp, message: "n'est pas une adresse email valide" }, allow_blank: true
end

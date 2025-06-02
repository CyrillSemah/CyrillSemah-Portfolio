class Contact
  include ActiveModel::Model
  include ActiveModel::Validations
  
  attr_accessor :first_name, :last_name, :email, :subject, :message, :name, :company
  
  validates :email, presence: { message: "L'email est obligatoire" }
  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP, message: "L'email n'est pas valide" }, if: -> { email.present? }
  validates :message, presence: { message: "Le message est obligatoire" }
  
  # Pour la compatibilité avec le code existant
  def name
    if first_name.present? && last_name.present?
      "#{first_name} #{last_name}"
    else
      @name
    end
  end
  
  def name=(value)
    @name = value
  end
end

module ApplicationHelper
  # Vérifie si l'utilisateur actuel est un administrateur connecté
  def admin?
    admin_user_signed_in?
  end
end

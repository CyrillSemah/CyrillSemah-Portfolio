module Authentication
  extend ActiveSupport::Concern
  
  included do
    helper_method :current_user, :user_signed_in?, :admin?
  end
  
  # Récupère l'utilisateur actuellement connecté
  def current_user
    @current_user ||= User.find_by(id: session[:user_id]) if session[:user_id]
  end
  
  # Vérifie si un utilisateur est connecté
  def user_signed_in?
    current_user.present?
  end
  
  # Vérifie si l'utilisateur connecté est un administrateur
  def admin?
    session[:admin] == true || (user_signed_in? && current_user.admin?)
  end
  
  # Redirige vers la page d'accueil si l'utilisateur n'est pas connecté
  def authenticate_user!
    unless user_signed_in?
      redirect_to root_path, alert: "Vous devez être connecté pour accéder à cette page."
    end
  end
  
  # Redirige vers la page d'accueil si l'utilisateur n'est pas administrateur
  def authenticate_admin!
    unless admin?
      redirect_to root_path, alert: "Vous n'êtes pas autorisé à accéder à cette section."
    end
  end
end

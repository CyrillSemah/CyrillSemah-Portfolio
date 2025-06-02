class AdminController < ApplicationController
  def login
    # Afficher simplement la page de connexion
  end

  def authenticate
    if params[:email] == "cyrillsemah@gmail.com" && params[:password].present?
      session[:admin] = true
      redirect_to admin_professional_experiences_path, notice: "Connexion réussie !"
    else
      flash.now[:alert] = "Email ou mot de passe incorrect."
      render :login, status: :unprocessable_entity
    end
  end
end

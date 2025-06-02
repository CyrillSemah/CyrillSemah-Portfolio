class SessionsController < ApplicationController
  def create
    auth = request.env["omniauth.auth"]
    user = User.from_omniauth(auth)
    
    session[:user_id] = user.id
    redirect_to root_path, notice: "Connecté avec succès!"
  end
  
  def failure
    redirect_to root_path, alert: "Échec de l'authentification. Veuillez réessayer."
  end
  
  def destroy
    session[:user_id] = nil
    session[:admin] = nil
    redirect_to root_path, notice: "Déconnecté avec succès!"
  end
end

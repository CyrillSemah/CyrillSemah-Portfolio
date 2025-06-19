class Admin::ProfileController < Admin::BaseController
  def edit
    @admin_user = current_admin_user
  end

  def update
    @admin_user = current_admin_user
    
    # Vérification du mot de passe actuel
    if !@admin_user.valid_password?(params[:admin_user][:current_password])
      @admin_user.errors.add(:current_password, "n'est pas valide")
      return render :edit, status: :unprocessable_entity
    end
    
    # Mise à jour du profil
    if admin_user_params[:password].blank?
      # Mise à jour sans changement de mot de passe
      if @admin_user.update(admin_user_params.except(:password, :password_confirmation))
        redirect_to edit_admin_profile_path, notice: "Votre profil a été mis à jour avec succès."
      else
        render :edit, status: :unprocessable_entity
      end
    else
      # Mise à jour avec changement de mot de passe
      if @admin_user.update(admin_user_params)
        bypass_sign_in(@admin_user) # Reconnexion avec le nouveau mot de passe
        redirect_to edit_admin_profile_path, notice: "Votre profil et mot de passe ont été mis à jour avec succès."
      else
        render :edit, status: :unprocessable_entity
      end
    end
  end

  private

  def admin_user_params
    params.require(:admin_user).permit(:email, :backup_email, :password, :password_confirmation)
  end
end

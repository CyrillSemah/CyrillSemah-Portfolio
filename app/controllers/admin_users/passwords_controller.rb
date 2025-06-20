class AdminUsers::PasswordsController < Devise::PasswordsController
  layout 'devise'
  
  # Personnalisation de la page de demande de réinitialisation
  def new
    super
  end
  
  # Personnalisation de l'envoi de l'email de réinitialisation
  def create
    # Extraire l'email des paramètres
    email = params[:admin_user][:email] if params[:admin_user]
    
    # Vérifier si l'email existe dans la base de données (email principal ou backup)
    admin_user = AdminUser.find_by("email = :email OR backup_email = :email", email: email) if email.present?
    
    if admin_user.present?
      # Si l'admin existe avec l'email principal ou de secours
      if admin_user.email != email && admin_user.backup_email == email
        # Si c'est l'email de secours, temporairement échanger les emails pour permettre la réinitialisation
        temp_email = admin_user.email
        admin_user.email = admin_user.backup_email
        admin_user.backup_email = temp_email
        admin_user.save(validate: false)
        
        # Envoyer les instructions
        self.resource = admin_user
        resource.send_reset_password_instructions
        
        # Restaurer les emails originaux
        admin_user.email = admin_user.backup_email
        admin_user.backup_email = email
        admin_user.save(validate: false)
      else
        # Si c'est l'email principal, utiliser le comportement standard
        self.resource = admin_user
        resource.send_reset_password_instructions
      end
      
      set_flash_message!(:notice, :send_instructions) if is_flashing_format?
      respond_with({}, location: after_sending_reset_password_instructions_path_for(resource_name))
    else
      # Si l'admin n'existe pas, afficher un message d'erreur
      self.resource = resource_class.new
      if email.present?
        flash.now[:alert] = "Aucun compte administrateur n'a été trouvé avec cette adresse email."
      end
      # Rendre la vue new au lieu d'utiliser respond_with qui cause l'erreur
      render :new
    end
  end
  
  # Personnalisation de la page de réinitialisation
  def edit
    super
  end
  
  # Personnalisation de la mise à jour du mot de passe
  def update
    super
  end
  
  protected
  
  # Redirection après réinitialisation du mot de passe
  def after_resetting_password_path_for(resource)
    admin_projects_path
  end
  
  # Redirection après envoi des instructions de réinitialisation
  def after_sending_reset_password_instructions_path_for(resource_name)
    new_session_path(resource_name) if is_navigational_format?
  end
end

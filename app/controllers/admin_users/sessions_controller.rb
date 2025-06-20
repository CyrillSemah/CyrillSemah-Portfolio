class AdminUsers::SessionsController < Devise::SessionsController
  layout 'devise'
  before_action :check_ip_lock, only: [:create]
  
  # Personnalisation de la page de connexion
  def new
    self.resource = resource_class.new(sign_in_params)
    clean_up_passwords(resource)
    yield resource if block_given?
    respond_with(resource, serialize_options(resource))
  end
  
  # Personnalisation de la connexion
  def create
    # Vérifier d'abord si l'IP est verrouillée (double vérification)
    client_ip = request.remote_ip
    login_attempt = LoginAttempt.find_or_create_by_ip(client_ip)
    
    if login_attempt.locked?
      flash.now[:alert] = "Trop de tentatives de connexion échouées. Veuillez réessayer dans #{(login_attempt.time_until_unlock / 60.0).ceil} minute(s)."
      self.resource = resource_class.new
      respond_with_navigational(resource) { render :new }
      return
    end
    
    # Récupérer l'email depuis les paramètres
    email = params[:admin_user][:email] if params[:admin_user]
    
    # Vérifier si l'utilisateur existe
    admin_user = AdminUser.find_by(email: email) if email.present?
    
    # Vérifier si le compte est déjà verrouillé
    if admin_user && admin_user.access_locked?
      flash.now[:alert] = "Votre compte est verrouillé. Veuillez réessayer dans quelques minutes."
      self.resource = resource_class.new
      respond_with_navigational(resource) { render :new }
      return
    end
    
    # Vérifier les avertissements
    if admin_user && admin_user.failed_attempts >= 4
      flash.now[:alert] = "Attention : C'est votre dernière tentative avant le verrouillage du compte pour 1 minute."
    elsif login_attempt.failed_attempts >= 4
      flash.now[:alert] = "Attention : C'est votre dernière tentative avant le verrouillage de l'accès pour 1 minute."
    end
    
    # Vérifier si c'est la 5ème tentative échouée et envoyer l'email avant même de tenter l'authentification
    if admin_user && admin_user.failed_attempts == 4
      # La prochaine tentative sera la 5ème, donc préparons l'email de verrouillage
      @email_prepared = true
    end
    
    begin
      self.resource = warden.authenticate!(auth_options)
      
      # Si l'authentification réussit, réinitialiser tous les compteurs d'échecs
      resource.update(failed_attempts: 0) if resource.respond_to?(:failed_attempts)
      login_attempt.reset_failed_attempts
      
      # Enregistrer les informations de connexion
      update_sign_in_info(resource, client_ip)
      
      # Envoyer un email de confirmation de connexion réussie
      SecurityMailer.successful_login(resource, client_ip).deliver_now
      
      set_flash_message!(:notice, :signed_in)
      sign_in(resource_name, resource)
      yield resource if block_given?
      respond_with resource, location: after_sign_in_path_for(resource)
      
    rescue => e
      # Gérer les erreurs d'authentification
      handle_failed_login(admin_user, client_ip)
      respond_with_navigational(resource) { render :new }
    end
  end
  
  # Personnalisation de la déconnexion
  def destroy
    signed_out = (Devise.sign_out_all_scopes ? sign_out : sign_out(resource_name))
    set_flash_message! :notice, :signed_out if signed_out
    yield if block_given?
    respond_to_on_destroy
  end
  
  protected
  
  # Vérifier si l'adresse IP est verrouillée
  def check_ip_lock
    client_ip = request.remote_ip
    
    # Vérifier si l'IP existe déjà dans la base de données
    login_attempt = LoginAttempt.find_by(ip_address: client_ip)
    
    # Si l'IP est verrouillée, bloquer l'accès
    if login_attempt && login_attempt.locked?
      flash.now[:alert] = "Trop de tentatives de connexion échouées. Veuillez réessayer dans #{(login_attempt.time_until_unlock / 60.0).ceil} minute(s)."
      self.resource = resource_class.new
      respond_with_navigational(resource) { render :new }
      throw(:warden)
    end
  end
  
  # Mettre à jour les informations de connexion
  def update_sign_in_info(user, ip_address)
    # Sauvegarder les informations actuelles comme "dernières informations"
    user.last_sign_in_user_agent = user.current_sign_in_user_agent
    user.last_sign_in_location = user.current_sign_in_location
    
    # Mettre à jour avec les nouvelles informations
    user.current_sign_in_user_agent = request.user_agent
    
    # Essayer de déterminer la localisation approximative à partir de l'IP
    # Dans un environnement de production, vous pourriez utiliser un service comme GeoIP
    # Pour l'instant, nous utilisons simplement l'IP
    user.current_sign_in_location = "IP: #{ip_address}"
    
    # Sauvegarder les modifications
    user.save(validate: false)
  end
  
  # Redirection après connexion
  def after_sign_in_path_for(resource)
    stored_location_for(resource) || admin_projects_path
  end
  
  # Redirection après déconnexion
  def after_sign_out_path_for(resource_or_scope)
    new_admin_user_session_path
  end
  
  # Répondre à la déconnexion
  def respond_to_on_destroy
    respond_to do |format|
      format.all { head :no_content }
      format.any(*navigational_formats) { redirect_to after_sign_out_path_for(resource_name) }
    end
  end
  
  # Gérer les tentatives de connexion échouées
  def handle_failed_login(admin_user=nil, client_ip=nil)
    # Récupérer l'email et l'IP si non fournis
    client_ip ||= request.remote_ip
    attempted_email = params[:admin_user][:email] if params[:admin_user]
    
    # Incrémenter le compteur d'échecs par IP
    login_attempt = LoginAttempt.find_or_create_by_ip(client_ip)
    login_attempt.increment_failed_attempts
    
    # Vérifier si l'IP est maintenant verrouillée
    if login_attempt.locked?
      flash.now[:alert] = "Trop de tentatives de connexion échouées. Votre accès est verrouillé pour 1 minute."
      self.resource = resource_class.new
      return
    end
    
    # Gérer le verrouillage par compte (uniquement pour les emails existants)
    admin_user ||= AdminUser.find_by(email: attempted_email) if attempted_email.present?
    
    if admin_user
      # Incrémenter le compteur d'échecs du compte
      new_failed_attempts = admin_user.failed_attempts + 1
      
      # Envoyer une notification par email pour chaque tentative échouée
      SecurityMailer.suspicious_login_attempt(admin_user, client_ip, new_failed_attempts).deliver_now
      
      # Vérifier si le compte doit être verrouillé
      if new_failed_attempts >= 5
        Rails.logger.info "=== ENVOI EMAIL DE VERROUILLAGE ===>"
        # IMPORTANT: Envoyer l'email de verrouillage AVANT de verrouiller le compte
        begin
          # Forcer l'envoi de l'email de verrouillage avec détails complets
          Rails.logger.info "Préparation de l'email pour #{admin_user.email} et #{admin_user.backup_email}"
          
          # Créer l'email directement
          mail = SecurityMailer.account_locked(admin_user, client_ip)
          
          # Vérifier les destinataires
          Rails.logger.info "Destinataires configurés: #{mail.to.inspect}"
          
          # Forcer l'envoi immédiat
          result = mail.deliver_now
          
          # Vérifier le résultat de l'envoi
          Rails.logger.info "Email de verrouillage envoyé avec succès: #{result.inspect}"
          Rails.logger.info "Headers: #{mail.header.inspect}"
        rescue => e
          Rails.logger.error "ERREUR lors de l'envoi de l'email de verrouillage: #{e.message}"
          Rails.logger.error e.backtrace.join("\n")
        end
        
        # Mettre à jour manuellement le compteur de tentatives
        admin_user.update(failed_attempts: new_failed_attempts)
        
        # Verrouiller le compte sans envoyer d'instructions par Devise
        admin_user.lock_access!(send_instructions: false)
        
        flash.now[:alert] = "Votre compte a été verrouillé pour 1 minute suite à plusieurs tentatives de connexion échouées."
      else
        admin_user.update(failed_attempts: new_failed_attempts)
        remaining_attempts = 5 - new_failed_attempts
        flash.now[:alert] = "Email ou mot de passe invalide. #{remaining_attempts} tentatives restantes."
      end
    else
      # Message générique avec nombre de tentatives restantes pour les emails inconnus
      flash.now[:alert] = "Email ou mot de passe invalide. #{login_attempt.attempts_remaining} tentatives restantes."
    end
    
    # Préparer le formulaire pour un nouveau rendu
    self.resource = resource_class.new(sign_in_params)
  end
end

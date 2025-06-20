class SecurityMailer < ApplicationMailer
  default from: ENV['GMAIL_USERNAME'] || 'no-reply@votre-portfolio.com'

  # Notification de tentative de connexion suspecte
  def suspicious_login_attempt(admin_user, ip_address, attempts_count)
    @admin_user = admin_user
    @ip_address = ip_address
    @attempts_count = attempts_count
    @remaining_attempts = 5 - attempts_count
    @time = Time.current
    
    # Envoyer à l'email principal et à l'email de secours s'il existe
    recipients = [@admin_user.email]
    recipients << @admin_user.backup_email if @admin_user.backup_email.present?
    
    mail(
      to: recipients,
      subject: "Alerte de sécurité - Tentative de connexion suspecte sur votre compte administrateur"
    )
  end
  
  # Notification de verrouillage de compte
  def account_locked(admin_user, ip_address)
    @admin_user = admin_user
    @ip_address = ip_address
    @time = Time.current
    @unlock_time = Time.current + 1.minute
    
    # Envoyer à l'email principal et à l'email de secours s'il existe
    recipients = [@admin_user.email]
    recipients << @admin_user.backup_email if @admin_user.backup_email.present?
    
    # Logs détaillés pour le débogage
    Rails.logger.info "=== PRÉPARATION EMAIL DE VERROUILLAGE ==="
    Rails.logger.info "Destinataires: #{recipients.join(', ')}"
    Rails.logger.info "From: #{self.class.default[:from]}"
    
    mail_obj = mail(
      to: recipients,
      subject: "Alerte de sécurité - Votre compte administrateur a été verrouillé"
    )
    
    Rails.logger.info "Email préparé: #{mail_obj.inspect}"
    
    mail_obj
  end
  
  # Notification de connexion réussie
  def successful_login(admin_user, ip_address)
    @admin_user = admin_user
    @ip_address = ip_address
    @time = Time.current
    @user_agent = admin_user.current_sign_in_user_agent if admin_user.respond_to?(:current_sign_in_user_agent)
    @location = admin_user.current_sign_in_location if admin_user.respond_to?(:current_sign_in_location)
    
    # Envoyer à l'email principal et à l'email de secours s'il existe
    recipients = [@admin_user.email]
    recipients << @admin_user.backup_email if @admin_user.backup_email.present?
    
    mail(
      to: recipients,
      subject: "Confirmation de connexion à votre compte administrateur"
    )
  end
end

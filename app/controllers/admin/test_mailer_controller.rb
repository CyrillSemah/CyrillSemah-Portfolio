class Admin::TestMailerController < ApplicationController
  def test_lock_email
    admin_user = AdminUser.first
    
    if admin_user.present?
      begin
        # Forcer l'envoi de l'email de verrouillage
        mail = SecurityMailer.account_locked(admin_user, request.remote_ip)
        result = mail.deliver_now
        
        # Logs détaillés
        Rails.logger.info "=== TEST EMAIL DE VERROUILLAGE ==="
        Rails.logger.info "Email envoyé à: #{mail.to}"
        Rails.logger.info "Résultat de l'envoi: #{result.inspect}"
        
        render plain: "Email de verrouillage envoyé avec succès à #{mail.to.join(', ')}"
      rescue => e
        Rails.logger.error "ERREUR lors de l'envoi de l'email: #{e.message}"
        Rails.logger.error e.backtrace.join("\n")
        render plain: "Erreur lors de l'envoi de l'email: #{e.message}", status: 500
      end
    else
      render plain: "Aucun administrateur trouvé", status: 404
    end
  end
end

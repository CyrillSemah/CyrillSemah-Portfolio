# Étend les fonctionnalités de verrouillage de Devise pour garantir l'envoi d'emails
# lors du verrouillage de compte administrateur

# Ajoute un hook pour intercepter le verrouillage de compte
module DeviseExtensions
  module LockableExtension
    extend ActiveSupport::Concern

    included do
      # Surcharge la méthode de verrouillage de Devise pour envoyer notre propre email
      def lock_access!(opts = {})
        # Capture l'adresse IP de la dernière tentative (si disponible)
        ip_address = self.last_sign_in_ip || '0.0.0.0'
        
        # Envoie l'email de verrouillage AVANT de verrouiller le compte
        begin
          Rails.logger.info "=== ENVOI EMAIL DE VERROUILLAGE DEPUIS L'EXTENSION ==="
          mail = SecurityMailer.account_locked(self, ip_address)
          result = mail.deliver_now
          Rails.logger.info "Email de verrouillage envoyé avec succès depuis l'extension: #{result.inspect}"
        rescue => e
          Rails.logger.error "ERREUR lors de l'envoi de l'email de verrouillage depuis l'extension: #{e.message}"
          Rails.logger.error e.backtrace.join("\n")
        end
        
        # Appelle la méthode originale pour verrouiller le compte
        # mais sans envoyer les instructions par défaut de Devise
        super(send_instructions: false)
      end
    end
  end
end

# Applique l'extension au modèle AdminUser
Rails.application.config.to_prepare do
  AdminUser.include DeviseExtensions::LockableExtension
end

class AdminUsers::TestMailerController < ApplicationController
  def test_account_locked
    # Récupérer l'admin user
    admin_user = AdminUser.first
    
    if admin_user
      # Tester l'envoi d'email de verrouillage
      begin
        mail = SecurityMailer.account_locked(admin_user, request.remote_ip)
        result = mail.deliver_now
        render plain: "Email de test envoyé avec succès à #{admin_user.email}. Vérifiez votre boîte de réception."
      rescue => e
        render plain: "Erreur lors de l'envoi de l'email: #{e.message}\n#{e.backtrace.join("\n")}"
      end
    else
      render plain: "Aucun admin user trouvé"
    end
  end
end

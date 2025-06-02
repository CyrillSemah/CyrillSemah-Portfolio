class ContactsController < ApplicationController
  def create
    @contact = Contact.new(contact_params)
    
    if @contact.valid?
      # Essayer d'envoyer l'email
      begin
        ContactMailer.contact_email(@contact).deliver_now
        success = true
        message = "Votre message a été envoyé avec succès!"
      rescue => e
        # Capturer les erreurs d'envoi d'email
        Rails.logger.error("Erreur d'envoi d'email: #{e.message}")
        success = false
        message = "Votre message a été reçu, mais il y a eu un problème avec l'envoi de l'email."
      end
      
      respond_to do |format|
        format.html { redirect_to root_path, notice: message }
        format.json { render json: { success: success, message: message } }
      end
    else
      respond_to do |format|
        format.html { redirect_to root_path, alert: "Une erreur est survenue: #{@contact.errors.full_messages.join(', ')}" }
        format.json { render json: { success: false, errors: @contact.errors.full_messages }, status: :unprocessable_entity }
      end
    end
  end
  
  private
  
  def contact_params
    params.require(:contact).permit(:first_name, :last_name, :company, :email, :subject, :message)
  end
end

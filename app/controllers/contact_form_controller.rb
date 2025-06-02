class ContactFormController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:create]
  
  def create
    @success = false
    @message = ""
    
    begin
      # Récupérer les paramètres du formulaire
      contact_params = params.require(:contact).permit(:first_name, :last_name, :email, :subject, :message, :company)
      
      # Vérification des paramètres requis
      if contact_params[:email].blank? || contact_params[:message].blank?
        @message = "L'email et le message sont obligatoires."
      elsif !valid_email?(contact_params[:email])
        @message = "L'adresse e-mail n'est pas valide."
      else
        # Créer un objet Contact
        @contact = Contact.new(contact_params)
        
        if @contact.valid?
          # Envoi de l'e-mail via le mailer
          ContactMailer.contact_email(@contact).deliver_now
          @success = true
          @message = "Votre message a été envoyé avec succès. Nous vous répondrons dès que possible."
        else
          @message = @contact.errors.full_messages.join(", ")
        end
      end
    rescue => e
      @message = "Une erreur est survenue lors de l'envoi du message. Veuillez réessayer plus tard."
      Rails.logger.error("Erreur d'envoi de mail: #{e.message}")
    end
    
    respond_to do |format|
      format.html { redirect_to root_path, notice: @success ? @message : @message }
      format.json { render json: { success: @success, message: @message } }
      format.js
    end
  end
  
  private
  
  def valid_email?(email)
    email =~ /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
  end
end

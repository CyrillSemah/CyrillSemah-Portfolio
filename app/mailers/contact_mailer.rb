class ContactMailer < ApplicationMailer
  default from: 'no-reply@portfolio.com'
  
  def contact_email(contact)
    @contact = contact
    @first_name = contact.first_name
    @last_name = contact.last_name
    @email = contact.email
    @subject_type = contact.subject || "Contact"
    @message = contact.message
    
    mail(
      to: "cyrillsemah@gmail.com",
      subject: "Nouveau message de contact: #{@subject_type}"
    )
  end
end

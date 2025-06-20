# Preview all emails at http://localhost:3000/rails/mailers/security_mailer
class SecurityMailerPreview < ActionMailer::Preview
  # Preview this email at http://localhost:3000/rails/mailers/security_mailer/suspicious_login_attempt
  def suspicious_login_attempt
    SecurityMailer.suspicious_login_attempt
  end
end

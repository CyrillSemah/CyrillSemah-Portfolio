#!/usr/bin/env ruby
# Ce script réinitialise le mot de passe de l'administrateur
# À exécuter avec: rails runner reset_admin_password.rb

admin = AdminUser.first

if admin
  new_password = "password123"
  admin.password = new_password
  admin.password_confirmation = new_password
  
  if admin.save
    puts "Le mot de passe de l'administrateur (#{admin.email}) a été réinitialisé avec succès."
    puts "Nouveau mot de passe: #{new_password}"
  else
    puts "Erreur lors de la réinitialisation du mot de passe: #{admin.errors.full_messages.join(', ')}"
  end
else
  # Créer un nouvel administrateur si aucun n'existe
  email = "cyrillsemah@gmail.com"
  password = "password123"
  
  admin = AdminUser.new(email: email, password: password, password_confirmation: password)
  
  if admin.save
    puts "Un nouvel administrateur a été créé avec succès."
    puts "Email: #{email}"
    puts "Mot de passe: #{password}"
  else
    puts "Erreur lors de la création de l'administrateur: #{admin.errors.full_messages.join(', ')}"
  end
end

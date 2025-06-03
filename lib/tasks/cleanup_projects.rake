namespace :cleanup do
  desc "Nettoyer les projets problématiques"
  task projects: :environment do
    puts "Recherche de projets problématiques..."
    
    # Trouver les projets avec un type de projet invalide ou nil
    invalid_projects = Project.where("project_type IS NULL OR project_type NOT IN ('development', 'retouche_creation')")
    
    if invalid_projects.any?
      puts "#{invalid_projects.count} projets problématiques trouvés."
      
      invalid_projects.each do |project|
        puts "Traitement du projet ##{project.id}: #{project.title}"
        
        # Supprimer les associations
        if defined?(project.project_visuals)
          project.project_visuals.each do |visual|
            puts "  - Suppression du visuel ##{visual.id}"
            visual.destroy!
          end
        end
        
        # Supprimer les pièces jointes
        if project.image.attached?
          puts "  - Suppression de l'image principale"
          project.image.purge
        end
        
        if defined?(project.development_images) && project.development_images.attached?
          puts "  - Suppression des images de développement"
          project.development_images.purge
        end
        
        # Forcer la suppression du projet
        if project.destroy
          puts "  ✓ Projet ##{project.id} supprimé avec succès"
        else
          puts "  ✗ Échec de la suppression normale, tentative de suppression forcée..."
          
          # Si la suppression normale échoue, essayer de supprimer directement de la base de données
          begin
            Project.connection.execute("DELETE FROM projects WHERE id = #{project.id}")
            puts "  ✓ Projet ##{project.id} supprimé par force de la base de données"
          rescue => e
            puts "  ✗ Erreur lors de la suppression forcée: #{e.message}"
          end
        end
      end
    else
      puts "Aucun projet problématique trouvé."
    end
    
    puts "Terminé."
  end
end

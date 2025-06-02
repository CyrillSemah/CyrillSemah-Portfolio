module SequentialId
  extend ActiveSupport::Concern

  module ClassMethods
    # Crée un nouvel enregistrement en utilisant l'ID disponible le plus bas
    def create_with_lowest_available_id(attributes = {})
      # Trouver tous les IDs existants
      existing_ids = self.pluck(:id).sort
      
      # Trouver le premier ID disponible
      next_id = 1
      existing_ids.each do |id|
        break if id != next_id
        next_id += 1
      end
      
      # Créer le nouvel enregistrement avec l'ID spécifié
      record = self.new(attributes)
      record.id = next_id
      record.save
      record
    end
  end
end

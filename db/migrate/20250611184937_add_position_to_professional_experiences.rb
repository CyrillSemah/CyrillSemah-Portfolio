class AddPositionToProfessionalExperiences < ActiveRecord::Migration[8.0]
  def change
    add_column :professional_experiences, :position, :string
  end
end

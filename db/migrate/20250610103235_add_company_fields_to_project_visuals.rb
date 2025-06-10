class AddCompanyFieldsToProjectVisuals < ActiveRecord::Migration[8.0]
  def change
    add_column :project_visuals, :company_name, :string
    add_column :project_visuals, :company_type, :string, default: 'existing'
    add_reference :project_visuals, :professional_experience, foreign_key: true, null: true
  end
end

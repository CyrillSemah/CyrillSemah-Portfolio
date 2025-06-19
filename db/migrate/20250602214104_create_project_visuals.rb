class CreateProjectVisuals < ActiveRecord::Migration[8.0]
  def change
    create_table :project_visuals do |t|
      t.references :project, null: false, foreign_key: true
      t.text :description
      t.integer :position, default: 0
      t.string :display_type, default: 'standard'
      t.string :visual_type, default: 'single'
      t.string :company

      t.timestamps
    end
    
    add_index :project_visuals, :position
    add_index :project_visuals, :display_type
    add_index :project_visuals, :visual_type
  end
end

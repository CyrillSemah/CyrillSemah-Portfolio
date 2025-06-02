class CreateSkillGroups < ActiveRecord::Migration[7.0]
  def change
    create_table :skill_groups do |t|
      t.string :name, null: false
      t.text :description
      t.integer :position, null: false, default: 0

      t.timestamps
    end
    
    add_index :skill_groups, :position
  end
end

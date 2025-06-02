class CreateSoftSkills < ActiveRecord::Migration[8.0]
  def change
    create_table :soft_skills do |t|
      t.string :name

      t.timestamps
    end
  end
end

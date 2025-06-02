class CreateSkills < ActiveRecord::Migration[8.0]
  def change
    create_table :skills do |t|
      t.string :name
      t.date :start_date
      t.text :description

      t.timestamps
    end
  end
end

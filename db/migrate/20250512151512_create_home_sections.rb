class CreateHomeSections < ActiveRecord::Migration[8.0]
  def change
    create_table :home_sections do |t|
      t.string :title
      t.text :subtitle
      t.string :cv_link
      t.string :talk_button_text
      t.string :download_button_text
      t.boolean :active, default: false

      t.timestamps
    end
  end
end

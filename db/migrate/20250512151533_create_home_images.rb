class CreateHomeImages < ActiveRecord::Migration[8.0]
  def change
    create_table :home_images do |t|
      t.string :image
      t.boolean :active, default: false
      t.references :home_section, foreign_key: true

      t.timestamps
    end
  end
end

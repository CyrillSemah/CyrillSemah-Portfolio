class CreateProjects < ActiveRecord::Migration[8.0]
  def change
    create_table :projects do |t|
      t.string :title
      t.text :description
      t.string :technologies
      t.string :github_url
      t.string :live_url
      t.string :image_url
      t.integer :position

      t.timestamps
    end
  end
end

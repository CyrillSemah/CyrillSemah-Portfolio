class AddDiplomeFieldsToEducations < ActiveRecord::Migration[8.0]
  def change
    add_column :educations, :diploma_id, :string
    add_column :educations, :diploma_url, :string
  end
end

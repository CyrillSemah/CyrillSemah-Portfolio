class AddCvFileToHomeSections < ActiveRecord::Migration[8.0]
  def change
    add_column :home_sections, :cv_file, :string
  end
end

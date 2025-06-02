class AddCategoryAndDisplayTypeToProjects < ActiveRecord::Migration[8.0]
  def change
    add_column :projects, :category, :string
    add_column :projects, :display_type, :string
  end
end

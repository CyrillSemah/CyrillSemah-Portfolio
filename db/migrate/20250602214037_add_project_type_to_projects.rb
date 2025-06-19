class AddProjectTypeToProjects < ActiveRecord::Migration[8.0]
  def change
    add_column :projects, :project_type, :string, default: 'development', null: false
    add_index :projects, :project_type
  end
end

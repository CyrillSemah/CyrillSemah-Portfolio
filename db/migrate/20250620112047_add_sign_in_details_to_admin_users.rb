class AddSignInDetailsToAdminUsers < ActiveRecord::Migration[8.0]
  def change
    add_column :admin_users, :current_sign_in_user_agent, :string
    add_column :admin_users, :current_sign_in_location, :string
    add_column :admin_users, :last_sign_in_user_agent, :string
    add_column :admin_users, :last_sign_in_location, :string
  end
end

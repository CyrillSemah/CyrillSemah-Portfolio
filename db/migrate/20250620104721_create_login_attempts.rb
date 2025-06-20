class CreateLoginAttempts < ActiveRecord::Migration[8.0]
  def change
    create_table :login_attempts do |t|
      t.string :ip_address, null: false
      t.integer :failed_attempts, default: 0, null: false
      t.datetime :last_attempt_at
      t.datetime :locked_until

      t.timestamps
    end
    
    add_index :login_attempts, :ip_address, unique: true
  end
end

class CreateEducations < ActiveRecord::Migration[8.0]
  def change
    create_table :educations do |t|
      t.string :school
      t.string :degree
      t.string :field_of_study
      t.integer :start_month
      t.integer :start_year
      t.integer :end_month
      t.integer :end_year
      t.string :result
      t.text :activities
      t.text :description

      t.timestamps
    end
  end
end

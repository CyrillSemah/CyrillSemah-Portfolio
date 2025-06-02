class CreateProfessionalExperiences < ActiveRecord::Migration[8.0]
  def change
    create_table :professional_experiences do |t|
      t.string :company_name
      t.string :job_title
      t.string :employment_type
      t.boolean :currently_working_here, default: false
      t.date :start_date
      t.date :end_date
      t.string :location
      t.string :workplace_type
      t.text :description

      t.timestamps
    end
  end
end

class ProfessionalExperience < ApplicationRecord
  include SequentialId
  has_one_attached :logo
  
  validates :company_name, :job_title, :employment_type, :start_date, :location, :workplace_type, :description, presence: true
  validates :currently_working_here, inclusion: { in: [true, false] }
  validate :end_date_after_start_date
  
  scope :ordered_by_date, -> { order(start_date: :desc) }
  
  private
  
  def end_date_after_start_date
    return if end_date.blank? || start_date.blank? || currently_working_here
    
    if end_date < start_date
      errors.add(:end_date, "doit être postérieure à la date de début")
    end
  end
end

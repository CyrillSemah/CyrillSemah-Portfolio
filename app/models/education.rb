class Education < ApplicationRecord
  include SequentialId
  has_one_attached :image
  has_one_attached :image_1
  has_one_attached :image_2
  
  validates :school, :degree, :field_of_study, :start_month, :start_year, presence: true
  validate :end_date_after_start_date
  
  scope :ordered_by_date, -> { order(start_year: :desc, start_month: :desc) }
  
  private
  
  def end_date_after_start_date
    return if end_year.blank? || end_month.blank? || start_year.blank? || start_month.blank?
    
    start_date = Date.new(start_year, start_month + 1, 1) # +1 car les mois sont stockés de 0 à 11
    end_date = Date.new(end_year, end_month + 1, 1)
    
    if end_date < start_date
      errors.add(:end_year, "doit être postérieure à la date de début")
    end
  end
end

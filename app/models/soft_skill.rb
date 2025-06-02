class SoftSkill < ApplicationRecord
  include SequentialId
  validates :name, presence: true, uniqueness: true
  
  scope :ordered_by_name, -> { order(name: :asc) }
end

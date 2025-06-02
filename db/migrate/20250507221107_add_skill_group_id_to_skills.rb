class AddSkillGroupIdToSkills < ActiveRecord::Migration[7.0]
  def change
    add_reference :skills, :skill_group, null: true, foreign_key: true
  end
end

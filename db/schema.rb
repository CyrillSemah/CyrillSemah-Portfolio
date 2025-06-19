# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_06_19_161342) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "admin_users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string "current_sign_in_ip"
    t.string "last_sign_in_ip"
    t.string "backup_email"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_admin_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_admin_users_on_reset_password_token", unique: true
  end

  create_table "admins", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_admins_on_email", unique: true
    t.index ["reset_password_token"], name: "index_admins_on_reset_password_token", unique: true
  end

  create_table "educations", force: :cascade do |t|
    t.string "school"
    t.string "degree"
    t.string "field_of_study"
    t.integer "start_month"
    t.integer "start_year"
    t.integer "end_month"
    t.integer "end_year"
    t.string "result"
    t.text "activities"
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "diploma_id"
    t.string "diploma_url"
  end

  create_table "home_images", force: :cascade do |t|
    t.string "image"
    t.boolean "active", default: false
    t.bigint "home_section_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["home_section_id"], name: "index_home_images_on_home_section_id"
  end

  create_table "home_sections", force: :cascade do |t|
    t.string "title"
    t.text "subtitle"
    t.string "cv_link"
    t.string "talk_button_text"
    t.string "download_button_text"
    t.boolean "active", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "cv_file"
  end

  create_table "professional_experiences", force: :cascade do |t|
    t.string "company_name"
    t.string "job_title"
    t.string "employment_type"
    t.boolean "currently_working_here", default: false
    t.date "start_date"
    t.date "end_date"
    t.string "location"
    t.string "workplace_type"
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "position"
  end

  create_table "project_visuals", force: :cascade do |t|
    t.bigint "project_id", null: false
    t.text "description"
    t.integer "position", default: 0
    t.string "display_type", default: "standard"
    t.string "visual_type", default: "single"
    t.string "company"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "company_name"
    t.string "company_type", default: "existing"
    t.bigint "professional_experience_id"
    t.index ["display_type"], name: "index_project_visuals_on_display_type"
    t.index ["position"], name: "index_project_visuals_on_position"
    t.index ["professional_experience_id"], name: "index_project_visuals_on_professional_experience_id"
    t.index ["project_id"], name: "index_project_visuals_on_project_id"
    t.index ["visual_type"], name: "index_project_visuals_on_visual_type"
  end

  create_table "projects", force: :cascade do |t|
    t.string "title"
    t.text "description"
    t.string "technologies"
    t.string "github_url"
    t.string "live_url"
    t.string "image_url"
    t.integer "position"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "category"
    t.string "display_type"
    t.jsonb "display_options", default: {}
    t.string "project_type", default: "development", null: false
    t.index ["project_type"], name: "index_projects_on_project_type"
  end

  create_table "skill_groups", force: :cascade do |t|
    t.string "name", null: false
    t.text "description"
    t.integer "position", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["position"], name: "index_skill_groups_on_position"
  end

  create_table "skills", force: :cascade do |t|
    t.string "name"
    t.date "start_date"
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "skill_group_id"
    t.index ["skill_group_id"], name: "index_skills_on_skill_group_id"
  end

  create_table "soft_skills", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", force: :cascade do |t|
    t.string "provider"
    t.string "uid"
    t.string "name"
    t.string "email"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "home_images", "home_sections"
  add_foreign_key "project_visuals", "professional_experiences"
  add_foreign_key "project_visuals", "projects"
  add_foreign_key "skills", "skill_groups"
end

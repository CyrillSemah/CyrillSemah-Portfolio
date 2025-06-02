require "test_helper"

class Admin::SkillsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get admin_skills_index_url
    assert_response :success
  end

  test "should get show" do
    get admin_skills_show_url
    assert_response :success
  end

  test "should get new" do
    get admin_skills_new_url
    assert_response :success
  end

  test "should get create" do
    get admin_skills_create_url
    assert_response :success
  end

  test "should get edit" do
    get admin_skills_edit_url
    assert_response :success
  end

  test "should get update" do
    get admin_skills_update_url
    assert_response :success
  end

  test "should get destroy" do
    get admin_skills_destroy_url
    assert_response :success
  end
end

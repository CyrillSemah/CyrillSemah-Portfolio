require "test_helper"

class Admin::HomeSectionsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get admin_home_sections_index_url
    assert_response :success
  end

  test "should get new" do
    get admin_home_sections_new_url
    assert_response :success
  end

  test "should get create" do
    get admin_home_sections_create_url
    assert_response :success
  end

  test "should get edit" do
    get admin_home_sections_edit_url
    assert_response :success
  end

  test "should get update" do
    get admin_home_sections_update_url
    assert_response :success
  end

  test "should get destroy" do
    get admin_home_sections_destroy_url
    assert_response :success
  end
end

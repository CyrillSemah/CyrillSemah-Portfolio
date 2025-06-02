require "test_helper"

class ProfessionalExperiencesControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get professional_experiences_index_url
    assert_response :success
  end

  test "should get new" do
    get professional_experiences_new_url
    assert_response :success
  end

  test "should get create" do
    get professional_experiences_create_url
    assert_response :success
  end

  test "should get edit" do
    get professional_experiences_edit_url
    assert_response :success
  end

  test "should get update" do
    get professional_experiences_update_url
    assert_response :success
  end

  test "should get destroy" do
    get professional_experiences_destroy_url
    assert_response :success
  end
end

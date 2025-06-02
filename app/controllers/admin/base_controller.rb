class Admin::BaseController < ApplicationController
  before_action :authenticate_admin!
  layout 'application'
  
  private
  
  def authenticate_admin!
    redirect_to admin_login_path unless admin?
  end
end

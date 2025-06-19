class AdminUsers::SessionsController < Devise::SessionsController
  layout 'devise'
  
  # Personnalisation de la page de connexion
  def new
    self.resource = resource_class.new(sign_in_params)
    clean_up_passwords(resource)
    yield resource if block_given?
    respond_with(resource, serialize_options(resource))
  end
  
  # Personnalisation de la connexion
  def create
    self.resource = warden.authenticate!(auth_options)
    set_flash_message!(:notice, :signed_in)
    sign_in(resource_name, resource)
    yield resource if block_given?
    respond_with resource, location: after_sign_in_path_for(resource)
  end
  
  # Personnalisation de la déconnexion
  def destroy
    signed_out = (Devise.sign_out_all_scopes ? sign_out : sign_out(resource_name))
    set_flash_message! :notice, :signed_out if signed_out
    yield if block_given?
    respond_to_on_destroy
  end
  
  protected
  
  # Redirection après connexion
  def after_sign_in_path_for(resource)
    stored_location_for(resource) || admin_projects_path
  end
  
  # Redirection après déconnexion
  def after_sign_out_path_for(resource_or_scope)
    new_admin_user_session_path
  end
  
  # Répondre à la déconnexion
  def respond_to_on_destroy
    respond_to do |format|
      format.all { head :no_content }
      format.any(*navigational_formats) { redirect_to after_sign_out_path_for(resource_name) }
    end
  end
end

Rails.application.config.middleware.use OmniAuth::Builder do
  provider :google_oauth2, ENV['GOOGLE_CLIENT_ID'], ENV['GOOGLE_CLIENT_SECRET'], {
    scope: 'email,profile',
    prompt: 'select_account'
  }
end

# Configurer OmniAuth pour utiliser uniquement les requêtes POST pour démarrer l'authentification
OmniAuth.config.allowed_request_methods = [:post]

# Configurer le chemin en cas d'échec d'authentification
OmniAuth.config.on_failure = Proc.new { |env|
  OmniAuth::FailureEndpoint.new(env).redirect_to_failure
}

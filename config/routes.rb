Rails.application.routes.draw do
  # Configuration Devise pour l'administrateur unique
  devise_for :admin_users, controllers: {
    sessions: 'admin_users/sessions',
    passwords: 'admin_users/passwords'
  }, skip: [:registrations]
  
  # Redirection de /admin vers la page de connexion admin
  # Routes pour les projets (partie publique)
  get "/projets", to: "projects#index", as: :projets
  get "/projets/:id", to: "projects#show", as: :projet
  # Page d'accueil (one-page)
  root "home#index"
  
  # Routes pour le formulaire de contact
  post "/contact", to: "contact_form#create", as: :contact_form
  
  # Routes pour les expériences professionnelles, formations et compétences (CRUD protégé par authentification)
  namespace :admin do
    # Route racine pour l'admin
    root to: 'professional_experiences#index'
    
    # Route pour le profil administrateur
    resource :profile, only: [:edit, :update], controller: 'profile'
    
    resources :projects do
      collection do
        get :choose_type
      end
      member do
        post :add_visual
        delete 'delete_development_image/:image_id', to: 'projects#delete_development_image', as: :delete_development_image
        patch 'replace_development_image/:image_id', to: 'projects#replace_development_image', as: :replace_development_image
      end
    end
    resources :home_sections do
      member do
        match :activate, via: [:get, :post]
      end
    end
    resources :skill_groups do
      collection do
        post :sort
      end
    end
    resources :skills
    resources :professional_experiences do
      member do
        get :logo
      end
    end
    resources :educations
    resources :soft_skills
  end
  
  # Redirection vers la page de connexion Devise
  get "/admin", to: redirect('/admin_users/sign_in'), as: :admin
  
  # Routes pour l'authentification
  get "/auth/:provider/callback", to: "sessions#create"
  get "/auth/failure", to: "sessions#failure"
  delete "/logout", to: "sessions#destroy", as: :logout
  
  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check
  
  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker
end

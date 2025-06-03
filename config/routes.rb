Rails.application.routes.draw do
  # Routes pour les projets (partie publique)
  get "/projets", to: "projects#index", as: :projets
  get "/projets/:id", to: "projects#show", as: :projet
  # Page d'accueil (one-page)
  root "home#index"
  
  # Routes pour le formulaire de contact
  post "/contact", to: "contact_form#create", as: :contact_form
  
  # Routes pour les expériences professionnelles, formations et compétences (CRUD protégé par authentification)
  namespace :admin do
    resources :projects do
      collection do
        get :choose_type
      end
      member do
        post :add_visual
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
    resources :professional_experiences
    resources :educations
    resources :skills
    resources :soft_skills
  end
  
  # Routes pour l'administration
  get "/admin", to: "admin#login", as: :admin_login
  post "/admin/authenticate", to: "admin#authenticate", as: :admin_authenticate
  
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

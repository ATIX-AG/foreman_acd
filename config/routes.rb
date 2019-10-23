# frozen_string_literal: true

Rails.application.routes.draw do
  scope :appcendep, :path => '/appcendep' do
    resources :app_definitions, :controller => 'foreman_appcendep/app_definitions' do
      collection do
        get 'auto_complete_search'
      end
    end

    resources :app_instances, :controller => 'foreman_appcendep/app_instances' do
      collection do
        get 'auto_complete_search'
      end

      member do
        post 'deploy'
      end
    end

    get 'ui_appcendep_app/:id', :to => 'ui_appcendep#app', :constraints => { :id => /[\w\.-]+/ }, :as => :ui_appcendep_app
    get 'ui_appcendep_fdata/:id', :to => 'ui_appcendep#fdata', :constraints => { :id => /[\w\.-]+/ }, :as => :ui_appcendep_fdata
  end
end

# frozen_string_literal: true

Rails.application.routes.draw do
  scope :acd, :path => '/acd' do
    resources :app_definitions, :controller => 'foreman_acd/app_definitions' do
      collection do
        get 'auto_complete_search'
        get 'import'
      end

      member do
        get 'export'
      end

    end

    resources :app_instances, :controller => 'foreman_acd/app_instances' do
      collection do
        get 'auto_complete_search'
      end

      member do
        post 'deploy'
        get 'report'
      end
    end

    get 'ui_acd_app/:id', :to => 'ui_acd#app', :constraints => { :id => /[\w\.-]+/ }, :as => :ui_acd_app
    get 'ui_acd_fdata/:id', :to => 'ui_acd#fdata', :constraints => { :id => /[\w\.-]+/ }, :as => :ui_acd_fdata
  end
end

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

    scope :api, :path => '/api', :defaults => { :format => 'json' } do
      scope '(:apiv)', :defaults => { :apiv => 'v2' }, :apiv => /v1|v2/, :constraints => ApiConstraints.new(:version => 2) do
        constraints(:id => /[\w\.-]+/) do
          resources :app_definitions, :only => [:show, :index, :create, :update, :destroy], :controller => 'foreman_appcendep/api/v2/app_definitions'
          resources :app_instances, :only => [:show, :index, :create, :update, :destroy], :controller => 'foreman_appcendep/api/v2/app_instances'
        end
      end
    end
  end
end

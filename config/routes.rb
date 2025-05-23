# frozen_string_literal: true

Rails.application.routes.draw do
  scope :acd, :path => '/acd' do
    resources :ansible_playbooks, :controller => 'foreman_acd/ansible_playbooks' do
      collection do
        get 'auto_complete_search'
        put 'sync_git_repo'
        post 'sync_git_repo'
      end

      member do
        post 'sync_git_repo'
        get 'import_vars'
      end
    end
    resources :app_definitions, :controller => 'foreman_acd/app_definitions' do
      collection do
        get 'auto_complete_search'
        get 'import'
        post 'handle_file_upload'
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
        delete 'destroy_with_hosts'
      end
    end

    match '/remote_execution', :controller => 'foreman_acd/remote_execution', :action => 'create', :via => [:post]

    get 'ui_acd_app/:id', :to => 'ui_acd#app', :constraints => { :id => /[\w.-]+/ }, :as => :ui_acd_app
    get 'ui_acd_foreman_data/:id', :to => 'ui_acd#foreman_data', :constraints => { :id => /[\w.-]+/ }, :as => :ui_acd_foreman_data
    get 'ui_acd_ansible_data/:id', :to => 'ui_acd#ansible_data', :constraints => { :id => /[\w.-]+/ }, :as => :ui_acd_ansible_data
    get 'ui_acd_report_data/:id', :to => 'ui_acd#report_data', :constraints => { :id => /[\w.-]+/ }, :as => :ui_acd_report_data
    get 'ui_acd_validate_hostname', :to => 'ui_acd#validate_hostname', :as => :ui_acd_validate_hostname

    scope :api, :path => '/api', :defaults => { :format => 'json' } do
      scope '(:apiv)', :defaults => { :apiv => 'v2' },
                       :apiv => /v1|v2/, :constraints => ApiConstraints.new(:version => 2) do
        constraints(:id => /[\w.-]+/) do
          resources :app_definitions, :only => [:show, :index], :controller => 'foreman_acd/api/v2/app_definitions', :as => :acd_api_v2_app_definitions
          resources :app_instances, :only => [:show, :index], :controller => 'foreman_acd/api/v2/app_instances', :as => :api_v2_foreman_acd_app_instances
          resources :ansible_playbooks, :only => [:show, :index], :controller => 'foreman_acd/api/v2/ansible_playbooks', :as => :api_v2_foreman_acd_ansible_playbooks do
            member do
              get 'grab'
            end
          end
        end
      end
    end
  end
end

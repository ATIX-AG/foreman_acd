# frozen_string_literal: true

Rails.application.routes.draw do
  scope :acd, :path => '/acd' do
    resources :ansible_playbooks, :controller => 'foreman_acd/ansible_playbooks' do
      collection do
        get 'auto_complete_search'
      end

      member do
        get 'import_vars'
      end

    end
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
        post 'configure'
        get 'report'
      end
    end

    get 'ui_acd_app/:id', :to => 'ui_acd#app', :constraints => { :id => /[\w\.-]+/ }, :as => :ui_acd_app
    get 'ui_acd_foreman_data/:id', :to => 'ui_acd#foreman_data', :constraints => { :id => /[\w\.-]+/ }, :as => :ui_acd_foreman_data
    get 'ui_acd_ansible_data/:playbook_id/group/:group_name', :to => 'ui_acd#ansible_data', :constraints => { :playbook_id => /[\w\.-]+/, :group_name => /[\w\.-]+/ }, :as => :ui_acd_ansible_data
  end
end

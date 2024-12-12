# frozen_string_literal: true

module ForemanAcd
  module Api
    module V2
      # API controller for Ansible Playbooks
      class AnsiblePlaybooksController < ::ForemanAcd::Api::V2::BaseController
        include ::Foreman::Controller::SmartProxyAuth
        include ::ForemanAcd::Concerns::AnsiblePlaybookParameters

        before_action :find_resource, :except => [:index, :create, :grab]

        add_smart_proxy_filters :grab, :features => 'ACD'

        api :GET, '/ansible_playbooks/:id', N_('Show ansible playbook')
        param :id, :identifier, :required => true
        def show
        end

        api :GET, '/ansible_playbooks', N_('List ansible playbooks')
        param_group :search_and_pagination, ::Api::V2::BaseController
        add_scoped_search_description_for(AnsiblePlaybook)
        def index
          @ansible_playbooks = resource_scope_for_index
        end

        def_param_group :ansible_playbook do
          param :ansible_playbook, Hash, :required => true, :action_aware => true do
            param :name, String, :required => true
            param_group :taxonomies, ::Api::V2::BaseController
            param :description, String, :required => true
            param :services, String, :required => true
          end
        end

        api :POST, '/ansible_playbooks', N_('Create a ansible playbook')
        param_group :ansible_playbook, :as => :create
        def create
          @ansible_playbook = AnsiblePlaybook.new(ansible_playbook_params)
          process_response @ansible_playbook.save
        end

        api :DELETE, '/ansible_playbooks/:id', N_('Deletes ansible playbook')
        param :id, :identifier, :required => true
        def destroy
          process_response @ansible_playbook.destroy
        end

        api :GET, '/ansible_playbooks/:id/grab', N_('Grab ansible playbook')
        param :id, :identifier, :required => true
        def grab
          ap = resource_class.find(params['id'])
          command = "tar cz -C #{ap.path} --exclude \".git\" . 2>/dev/null | base64"
          result = `#{command}`
          send_data result, :type => 'text/plain', :disposition => 'inline'
        end

        def action_permission
          case params[:action]
          when 'grab'
            'grab'
          else
            super
          end
        end

        def resource_class
          ForemanAcd::AnsiblePlaybook
        end
      end
    end
  end
end

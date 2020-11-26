# frozen_string_literal: true

module ForemanAcd
  module Api
    module V2
      # API controller for App Instances
      class AppInstancesController < ::ForemanAcd::Api::V2::BaseController
        include ::ForemanAcd::Concerns::AppInstanceParameters

        before_action :find_resource, :except => [:index, :create]

        api :GET, '/app_instances/:id', N_('Show application instance')
        param :id, :identifier, :required => true
        def show; end

        api :GET, '/app_instances', N_('List application instances')
        param_group :search_and_pagination, ::Api::V2::BaseController
        add_scoped_search_description_for(AppInstance)
        def index
          @app_instances = resource_scope_for_index
        end

        def_param_group :app_instance do
          param :app_instance, Hash, :required => true, :action_aware => true do
            param :name, String, :required => true
            param :description, String, :required => true
            param :services, String, :required => true
          end
        end

        api :POST, '/app_instances', N_('Create a application instance')
        param_group :app_instance, :as => :create
        def create
          @app_instance = AppInstance.new(app_instance_params)
          process_response @app_instance.save
        end

        api :DELETE, '/app_instances/:id', N_('Deletes application instance')
        param :id, :identifier, :required => true
        def destroy
          process_response @app_instance.destroy
        end

        def controller_permission
          'app_instances'
        end

        def resource_class
          ForemanAcd::AppInstance
        end
      end
    end
  end
end

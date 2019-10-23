# frozen_string_literal: true

module ForemanAppcendep
  module Api
    module V2
      # API controller for App Definitions
      class AppDefinitionsController < ::ForemanAppcendep::Api::V2::BaseController
        include ::ForemanAppcendep::Concerns::AppDefinitionParameters

        before_action :find_resource, :except => [:index, :create]

        api :GET, '/app_definitions/:id', N_('Show application definition')
        param :id, :identifier, :required => true
        def show; end

        api :GET, '/app_definitions', N_('List application definitions')
        param_group :search_and_pagination, ::Api::V2::BaseController
        add_scoped_search_description_for(AppDefinition)
        def index
          @app_definitions = resource_scope_for_index
        end

        def_param_group :app_definition do
          param :app_definition, Hash, :required => true, :action_aware => true do
            param :name, String, :required => true
            param :description, String, :required => true
            param :hostgroup_id, :number, :required => true
            param :parameters, String, :required => true
          end
        end

        api :POST, '/app_definitions', N_('Create a application definition')
        param_group :app_definition, :as => :create
        def create
          @app_definition = AppDefinition.new(app_definition_params)
          process_response @app_definition.save
        end

        api :DELETE, '/app_definitions/:id', N_('Deletes application definition')
        param :id, :identifier, :required => true
        def destroy
          process_response @app_definition.destroy
        end

        def controller_permission
          'app_definitions'
        end

        def resource_class
          ForemanAppcendep::AppDefinition
        end
      end
    end
  end
end

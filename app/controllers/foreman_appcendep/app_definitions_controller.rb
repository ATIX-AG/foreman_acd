# frozen_string_literal: true

module ForemanAppcendep
  # Application Definition Controller
  class AppDefinitionsController < ::ForemanAppcendep::ApplicationController
    include Foreman::Controller::AutoCompleteSearch
    include ::ForemanAppcendep::Concerns::AppDefinitionParameters

    before_action :find_resource, :only => [:edit, :update, :destroy]

    def index
      @app_definitions = resource_base.search_for(params[:search], :order => params[:order]).paginate(:page => params[:page])
    end

    def new
      @app_definition = AppDefinition.new
    end

    def create
      @app_definition = AppDefinition.new(app_definition_params)
      if @app_definition.save
        process_success
      else
        process_error
      end
    end

    def edit; end

    def update
      local_params = app_definition_params.clone
      app_param = local_params.delete :application_parameters
      if app_param
        ap = ::ApplicationParameter.find_or_initialize_by(:id => app_param[:id])
        if app_param.delete(:_destroy) == 'true'
          ap.destroy
        else
          ap.update(app_param)
          ap.application = @app_definition
          ap.save
        end
      end
      if @app_definition.update(local_params)
        process_success
      else
        process_error
      end
    end

    def destroy
      if @app_definition.destroy
        process_success
      else
        process_error
      end
    end
  end
end

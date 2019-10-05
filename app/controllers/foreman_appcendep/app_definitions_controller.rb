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
      logger.info "XXXXXXXXXXXXXXXXXXXXXXX #{@app_definition.parameters.class}"
      logger.info "YYYYYYYYYYYYYYYYYYYYYYY #{@app_definition.parameters}"
      if @app_definition.update(app_definition_params)
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

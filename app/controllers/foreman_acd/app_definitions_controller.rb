# frozen_string_literal: true

module ForemanAcd
  # Application Definition Controller
  class AppDefinitionsController < ::ForemanAcd::ApplicationController
    include Foreman::Controller::AutoCompleteSearch
    include ::ForemanAcd::Concerns::AppDefinitionParameters

    before_action :find_resource, :only => [:edit, :update, :destroy]

    def index
      @app_definitions = resource_base.search_for(params[:search], :order => params[:order]).paginate(:page => params[:page])
    end

    def read_hostgroups
      @hostgroups = Hostgroup.all.map { |elem| { elem.id => elem.name } }.reduce({}) { |h, v| h.merge v }
    end

    def new
      read_hostgroups
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

    def edit
      read_hostgroups
    end

    def update
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

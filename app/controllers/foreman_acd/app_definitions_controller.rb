# frozen_string_literal: true

module ForemanAcd
  # Application Definition Controller
  class AppDefinitionsController < ::ForemanAcd::ApplicationController
    include Foreman::Controller::AutoCompleteSearch
    include ::ForemanAcd::Concerns::AppDefinitionParameters

    before_action :find_resource, :only => [:edit, :update, :destroy, :export]
    before_action :read_hostgroups, :only => [:edit, :new, :import]
    before_action :read_ansible_playbooks, :only => [:edit, :new]
    before_action :handle_file_upload, :only => [:create]

    def index
      @app_definitions = resource_base.search_for(params[:search], :order => params[:order]).paginate(:page => params[:page])
    end

    def read_ansible_playbooks
      # Only use ansible playbooks for which the user pressed import group vars once.
      @ansible_playbooks = AnsiblePlaybook.where.not(vars: nil).map { |elem| { elem.id => elem.name } }.reduce({}) { |h, v| h.merge v }
    end

    def read_hostgroups
      @hostgroups = Hostgroup.all.map { |elem| { elem.id => elem.name } }.reduce({}) { |h, v| h.merge v }
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

    def edit
    end

    def update
      if @app_definition.update_attributes(app_definition_params)
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

    def action_permission
      case params[:action]
      when 'export'
        :export
      else
        super
      end
    end

    def import
      @app_definition = AppDefinition.new
    end

    def export
      filename = "#{@app_definition.name}.yaml"
      data = JSON.parse(@app_definition.services).to_yaml
      send_data data, :type => 'text/yaml', :disposition => 'attachment', :filename => filename
    end

    private

    def handle_file_upload
      return unless params[:foreman_acd_app_definition] && raw_file = params[:foreman_acd_app_definition][:app_definition_file]
      params[:foreman_acd_app_definition][:services] = YAML.load_file(raw_file.tempfile).to_json
    end
  end
end

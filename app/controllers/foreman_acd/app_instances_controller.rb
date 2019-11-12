# frozen_string_literal: true

module ForemanAcd
  # Application Instance Controller
  class AppInstancesController < ::ForemanAcd::ApplicationController
    include Foreman::Controller::AutoCompleteSearch
    include ::ForemanAcd::Concerns::AppInstanceParameters

    before_action :find_resource, :only => [:edit, :update, :destroy, :deploy]

    def index
      @app_instances = resource_base.search_for(params[:search], :order => params[:order]).paginate(:page => params[:page])
    end

    def read_applications
      @applications = ForemanAcd::AppDefinition.all.map { |elem| { elem.id => elem.name } }.reduce({}) { |h, v| h.merge v }
    end

    def new
      @app_instance = AppInstance.new
      read_applications
    end

    def create
      @app_instance = AppInstance.new(app_instance_params)
      if @app_instance.save
        process_success
      else
        process_error
      end
    end

    def edit
      read_applications
    end

    def update
      if @app_instance.update(app_instance_params)
        process_success
      else
        process_error
      end
    end

    def destroy
      if @app_instance.destroy
        process_success
      else
        process_error
      end
    end

    def action_permission
      case params[:action]
      when 'deploy'
        :deploy
      else
        super
      end
    end

    def deploy
      params = host_attributes(set_host_params)

      # Print to log for debugging purposes
      logger.info("Host creation parameters:\n#{params}\n")

      @host = Host.new(params)
      apply_compute_profile(@host)
      @host.suggest_default_pxe_loader
      @host.save
      success _('Successfully initiated host creation')
    rescue StandardError => e
      logger.error("Failed to initiate host creation: #{e.backtrace.join($INPUT_RECORD_SEPARATOR)}")
    ensure
      redirect_to app_instances_path
    end

    private

    # Copied from foreman/app/controllers/api/v2/hosts_controller.rb
    def apply_compute_profile(host)
      host.apply_compute_profile(InterfaceMerge.new(:merge_compute_attributes => true))
      host.apply_compute_profile(ComputeAttributeMerge.new)
    end

    # Copied from foreman/app/controllers/api/v2/hosts_controller.rb
    def host_attributes(params, host = nil)
      return {} if params.nil?

      params = params.deep_clone
      if params[:interfaces_attributes]
        # handle both hash and array styles of nested attributes
        params[:interfaces_attributes] = params[:interfaces_attributes].values if params[:interfaces_attributes].is_a?(Hash) || params[:interfaces_attributes].is_a?(ActionController::Parameters)
        # map interface types
        params[:interfaces_attributes] = params[:interfaces_attributes].map do |nic_attr|
          interface_attributes(nic_attr, :allow_nil_type => host.nil?)
        end
      end
      params = host.apply_inherited_attributes(params) if host
      params
    end

    # Copied from foreman/app/controllers/api/v2/hosts_controller.rb
    def interface_attributes(params, allow_nil_type: false)
      params[:type] = InterfaceTypeMapper.map(params[:type]) if params.key?(:type) || allow_nil_type
      params
    end

    def hardcoded_params
      result = {}
      result['managed'] = true
      result['enabled'] = true
      result['build'] = true
      result['compute_attributes'] = { 'start' => '1' }
      result['host_parameters_attributes'] = []
      result
    end

    def set_host_params
      result = hardcoded_params
      result['hostgroup_id'] = @app_instance.app_definition.hostgroup_id
      JSON.parse(@app_instance.parameters).each do |param|
        case param['type']

        when 'computeprofile'
          result['compute_profile_id'] = param['value']

        when 'domain'
          result['domain_id'] = param['value']

        when 'hostname'
          result['name'] = param['value']

        when 'hostparam'
          result['host_parameters_attributes'].push(:name => param['name'], :value => param['value'])

        when 'ip'
          result['ip'] = param['value']

        when 'lifecycleenv'
          result['content_facet_attributes'] = { 'lifecycle_environment_id' => param['value'] }

        when 'ptable'
          result['ptable_id'] = param['value']

        when 'puppetenv'
          result['environment_id'] = param['value']

        when 'password'
          result['root_pass'] = param['value']

        end
      end
      result
    end
  end
end

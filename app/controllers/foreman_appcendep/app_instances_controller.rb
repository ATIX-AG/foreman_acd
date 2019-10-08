# frozen_string_literal: true

module ForemanAppcendep
  # Application Instance Controller
  class AppInstancesController < ::ForemanAppcendep::ApplicationController
    include Foreman::Controller::AutoCompleteSearch
    include ::ForemanAppcendep::Concerns::AppInstanceParameters

    before_action :find_resource, :only => [:edit, :update, :destroy, :deploy]

    def index
      @app_instances = resource_base.search_for(params[:search], :order => params[:order]).paginate(:page => params[:page])
    end

    def read_applications
      @applications = ForemanAppcendep::AppDefinition.all.map { |elem| { elem.id => elem.name } }.reduce({}) { |h, v| h.merge v }
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
      @host = Host.new(set_host_params)
      @host.save
      success _('Successfully initiated host creation')
    rescue => e
      error _('Failed to initiate host creation: %s') % e.to_s
      logger.error("Failed to initiate host creation: #{e.backtrace.join($/)}")
    ensure
      redirect_to app_instances_path
    end

    private

    def hardcoded_params
      result = {}
      # result['managed'] = true -> doesn't work right now as neccessary parameters are missing:
      # 2019-10-08T12:01:25 [W|app|c0cf3627] Not queueing Nic::Managed: ["MAC address can't be blank"]
      # 2019-10-08T12:01:25 [W|app|c0cf3627] Not queueing Host::Managed: ["Mac can't be blank"]
      result['host_parameters_attributes'] = Array.new
      return result
    end

    def set_host_params
      result = hardcoded_params
      result['hostgroup_id'] = @app_instance.app_definition.hostgroup_id
      JSON.parse(@app_instance.parameters).each do |param|
        case param['type']
        when 'lifecycleenv'
          # TODO: need to run on a host with katello
          #result['lifecycle_environment_id'] = param['value']
        when 'puppetenv'
          result['environment_id'] = param['value']
        when 'hostname'
          result['name'] = param['value']
        when 'hostparam'
          result['host_parameters_attributes'].push({:name => param['name'], :value => param['value']})
        when 'password'
          result['root_pass'] = param['value']
        when 'ip'
          result['ip'] = param['value']
        end
      end
      return result
    end
  end
end

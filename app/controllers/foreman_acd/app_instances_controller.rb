# frozen_string_literal: true

module ForemanAcd
  # Application Instance Controller
  class AppInstancesController < ::ForemanAcd::ApplicationController
    include Foreman::Controller::AutoCompleteSearch
    include ::ForemanAcd::Concerns::AppInstanceParameters

    before_action :find_resource, :only => [:edit, :update, :destroy, :deploy, :report, :configure]
    before_action :read_applications, :only => [:new, :edit]

    def index
      @app_instances = resource_base.search_for(params[:search], :order => params[:order]).paginate(:page => params[:page])
    end

    def read_applications
      @applications = AppDefinition.all.map { |elem| { elem.id => elem.name } }.reduce({}) { |h, v| h.merge v }
    end

    def new
      @app_instance = AppInstance.new
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
      when 'report'
        :report
      when 'configure'
        :configure
      else
        super
      end
    end

    def deploy
      app_deployer = ForemanAcd::AppDeployer.new(@app_instance)

      # save any change to the app_hosts json
      @app_instance.hosts = app_deployer.deploy.to_json
      @app_instance.save

      @deploy_hosts = app_deployer.deploy_hosts
    end

    def report
      @report_hosts = []
      app_hosts = JSON.parse(@app_instance.hosts)
      app_hosts.each do |host_data|
        h = Host.find(host_data['foreman_host_id'])
        @report_hosts.push({id: h.id, name: host_data['hostname'], hostname: h.hostname, hostUrl: host_path(h), powerStatusUrl: power_api_host_path(h) })
      end

      logger.debug("deploy report hosts are: #{@report_hosts.inspect}")
    end

    def configure
      app_configurator = ForemanAcd::AppConfigurator.new(@app_instance)
      job_invocations = app_configurator.configure

      # redirect to the job itself if we only have one job, otherwise to the index page
      if job_invocations.count == 1
        redirect_to job_invocation_path(job_invocations.first)
      else
        redirect_to job_invocations_path
      end
    end
  end
end

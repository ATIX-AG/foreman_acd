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
      app_hosts = app_deployer.deploy

      # save any change to the app_hosts json
      @app_instance.hosts = app_hosts.to_json
      @app_instance.save

      @deploy_hosts = collect_host_report_data(app_hosts)
    end

    def report
      app_hosts = JSON.parse(@app_instance.hosts)
      @report_hosts = collect_host_report_data(app_hosts)

      logger.debug("deploy report hosts are: #{@report_hosts.inspect}")
    end

    def configure
      app_configurator = ForemanAcd::AppConfigurator.new(@app_instance)
      jobs = app_configurator.configure
      job_count = jobs.count

      customize_first = if params[:customize] == 'true'
                          true
                        else
                          false
                        end

      logger.debug("Created #{job_count} to configure #{@app_instance} - customize: #{customize_first}")

      if job_count == 1 && customize_first == false
        jobs.first.trigger!
        redirect_to job_invocation_path(jobs.first.job_invocation)
      elsif customize_first == false
        jobs.each do |composer|
          composer.save
        end
        # redirect to the job itself if we want to customize the job
        redirect_to job_invocations_path
      else
        # redirect to the job itself if we only have one job, otherwise to the index page
        redirect_to job_invocations_path
      end
    end

    private

    def read_applications
      @applications = AppDefinition.all.map { |elem| { elem.id => elem.name } }.reduce({}) { |h, v| h.merge v }
    end

    def collect_host_report_data(app_hosts)
      report_data = []
      app_hosts.each do |host_data|
        host = Host.find(host_data['foreman_host_id'])
        report_data << { id: host.id, name: host_data['hostname'], hostname: host.hostname, hostUrl: host_path(host), progress_report_id: host.progress_report_id}
      end
      report_data
    end
  end
end

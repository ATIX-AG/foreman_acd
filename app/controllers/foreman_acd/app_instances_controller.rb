# frozen_string_literal: true

module ForemanAcd
  # Application Instance Controller
  class AppInstancesController < ::ForemanAcd::ApplicationController
    include Foreman::Controller::AutoCompleteSearch
    include ::ForemanAcd::Concerns::AppInstanceParameters

    before_action :find_resource, :only => [:edit, :update, :destroy, :deploy, :report]
    before_action :read_applications, :only => [:new, :edit]
    before_action :find_taxonomy
    helper_method :collect_hosts_data

    def index
      @app_instances = resource_base.where(:organization => @organization).
                       where(:location => @location).
                       search_for(params[:search], :order => params[:order]).paginate(:page => params[:page])
    end

    def new
      @app_instance = AppInstance.new
      @app_instance.organization = @organization
      @app_instance.location = @location
    end

    def create
      @app_instance = AppInstance.new(app_instance_params)
      if @app_instance.save
        app_instance_has_foreman_hosts
        process_success
      else
        process_error
      end
    end

    def edit; end

    def update
      if @app_instance.update(app_instance_params)
        app_instance_has_foreman_hosts
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
      else
        super
      end
    end

    def deploy
      app_deployer = ForemanAcd::AppDeployer.new(@app_instance)
      app_deployer.deploy

      @deploy_hosts = collect_host_report_data
    end

    def report
      @report_hosts = collect_host_report_data

      logger.debug("app instance host details: #{@report_hosts.inspect}")
    end

    def app_instance_has_foreman_hosts
      hosts = JSON.parse(@app_instance.hosts)
      hosts.each do |h|
        if @app_instance.foreman_hosts.where(:hostname => h['hostname']).exists?
          @app_instance.foreman_hosts.where(:hostname => h['hostname']).
            update(:service => h['service'], :description => h['description'],
                   :foremanParameters => JSON.dump(h['foremanParameters']), :ansibleParameters => JSON.dump(h['ansibleParameters']))
        else
          @app_instance.foreman_hosts.create(:hostname => h['hostname'], :service => h['service'], :description => h['description'],
                                             :foremanParameters => JSON.dump(h['foremanParameters']), :ansibleParameters => JSON.dump(h['ansibleParameters']))
        end
      end

      # Delete record if json hosts are deleted
      deleted_json_hosts = @app_instance.foreman_hosts.pluck('hostname') - hosts.pluck('hostname')
      @app_instance.foreman_hosts.where(:hostname => deleted_json_hosts).destroy_all if deleted_json_hosts
    end

    def collect_hosts_data
      hosts_data = []
      @app_instance.foreman_hosts.each do |h|
        hosts_data << {
          :id => h.id,
          :hostname => h.hostname,
          :service => h.service,
          :description => h.description,
          :foremanParameters => JSON.parse(h.foremanParameters),
          :ansibleParameters => JSON.parse(h.ansibleParameters)
        }
      end
      hosts_data
    end

    private

    def find_taxonomy
      @organization = Organization.current
      redirect_to '/select_organization?toState=' + request.path unless @organization

      @location = Location.current
      redirect_to root_url, :alert => 'Select a location to show App Instances' unless @location
    end

    def read_applications
      @applications = AppDefinition.all.map { |elem| { elem.id => elem.name } }.reduce({}) { |h, v| h.merge v }
    end

    def collect_host_report_data
      report_data = []
      @app_instance.foreman_hosts.each do |foreman_host|
        report_data << {
          :id => foreman_host.host.id,
          :name => foreman_host.hostname,
          :build => foreman_host.host.build,
          :hostname => foreman_host.host.hostname,
          :hostUrl => host_path(foreman_host.host),
          :progress_report_id => foreman_host.host.progress_report_id
        }
      end
      report_data
    end
  end
end

# frozen_string_literal: true

module ForemanAcd
  # Application Instance Controller
  class AppInstancesController < ::ForemanAcd::ApplicationController
    include ::Foreman::Controller::AutoCompleteSearch
    include ::ForemanAcd::Concerns::AppInstanceParameters
    include ::ForemanAcd::Concerns::AppInstanceMixins

    before_action :find_resource, :only => [:edit, :update, :destroy_with_hosts, :deploy, :report]
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
      begin
        if @app_instance.save!
          app_instance_has_foreman_hosts
          process_success
        else
          process_error
        end
      rescue StandardError, ValidationError => e
        redirect_to new_app_instance_path, :flash => { :error => _(e.message) }
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

    def destroy_with_hosts
      @app_instance = AppInstance.find(params[:id])
      @app_instance.clean_hosts_by_id(params[:foreman_host_ids]) if params[:foreman_host_ids]
      if @app_instance.destroy
        redirect_to app_instances_path, :flash => { :success => _('Successfully deleted %s') % @app_instance }
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
      when 'destroy_with_hosts'
        :destroy
      else
        super
      end
    end

    def deploy
      value = false
      @app_instance.clean_all_hosts if params[:delete_hosts]
      value = safe_deploy? if params[:safe_deploy]
      session.delete(:remember_hosts)
      logger.info('Run async foreman task to deploy hosts')
      async_task = ForemanTasks.async_task(::Actions::ForemanAcd::DeployAllHosts, @app_instance, value)
      @app_instance.update!(:last_deploy_task => async_task)
      redirect_to report_app_instance_path, :success => _('Started task to deploy hosts for %s') % @app_instance
    rescue StandardError => e
      error_msg = "Error happend while deploying hosts of #{@app_instance}: #{e.message}"
      logger.error("#{error_msg} - #{e.class}\n#{e.backtrace.join($INPUT_RECORD_SEPARATOR)}")
      process_error :error_msg => error_msg
    end

    def safe_deploy?
      return false if session[:remember_hosts].empty?
      session[:remember_hosts]
    end

    def report
      @report_hosts = collect_host_report_data(@app_instance)
      logger.debug("app instance host details: #{@report_hosts.inspect}")
    end

    def app_instance_has_foreman_hosts
      hosts = JSON.parse(@app_instance.hosts)
      session[:remember_hosts] = []
      hosts.each do |h|
        if @app_instance.foreman_hosts.where(:hostname => h['hostname']).exists?
          old_host = @app_instance.foreman_hosts.find_by(:hostname => h['hostname'])

          @app_instance.foreman_hosts.where(:hostname => h['hostname']).
            update(:service => h['service'], :description => h['description'],
                   :foremanParameters => JSON.dump(h['foremanParameters']), :ansibleParameters => JSON.dump(h['ansibleParameters']))

          updated_host = @app_instance.foreman_hosts.find_by(:hostname => h['hostname'])

          # Store hosts if updated for safe deploy
          session[:remember_hosts] << updated_host.id if updated_host.updated_at != old_host.updated_at
        else
          @app_instance.foreman_hosts.create(:hostname => h['hostname'],
                                             :service => h['service'],
                                             :description => h['description'],
                                             :is_existing_host => h['isExistingHost'],
                                             :foremanParameters => JSON.dump(h['foremanParameters']),
                                             :ansibleParameters => JSON.dump(h['ansibleParameters']))
          # Store new hosts for safe deploy
          session[:remember_hosts] << @app_instance.foreman_hosts.find_by(:hostname => h['hostname']).id
        end
      end

      # Delete record if json hosts are deleted
      deleted_json_hosts = @app_instance.foreman_hosts.pluck('hostname') - hosts.pluck('hostname')
      @app_instance.foreman_hosts.where(:hostname => deleted_json_hosts).destroy_all if deleted_json_hosts
    end

    private

    def find_taxonomy
      @organization = Organization.current
      redirect_to '/select_organization?toState=' + request.path and return unless @organization

      @location = Location.current
      redirect_to root_path, :error => 'Select a location to show App Instances' and return unless @location
    end

    def read_applications
      @applications = AppDefinition.all.map { |elem| { elem.id => elem.name } }.reduce({}) { |h, v| h.merge v }
    end
  end
end

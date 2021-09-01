# frozen_string_literal: true

module ForemanAcd
  # Extends the Host Managed
  module HostManagedExtensions
    extend ActiveSupport::Concern

    RUN_CONFIGURATOR_DELAY = 240

    def self.prepended(base)
      base.instance_eval do
        before_provision :initiate_acd_app_configurator, :if => :deployed_via_acd?
        before_destroy :check_deletable, :prepend => true
      end
    end

    def deployed_via_acd?
      find_app_instance_host
      @app_instance_host.present?
    end

    private

    def check_deletable
      app_instance_host = ForemanAcd::ForemanHost.find_by(:host_id => id)
      return if app_instance_host.nil?

      ::Foreman::Logging.logger('foreman_acd').warn "Could not delete host '#{name}' because it is used in Applications > App Instances '#{app_instance_host.app_instance.name}'"
      raise _("Could not delete host '%{host_name}' because it is used in Applications > App Instances '%{app_instance_name}'") % {
        :host_name => name, :app_instance_name => app_instance_host.app_instance.name
      }
    end

    def find_app_instance_host
      @app_instance_host = ForemanAcd::ForemanHost.find_by(:host_id => id)
    end

    def initiate_acd_app_configurator
      return if @app_instance_host.blank?
      return unless @app_instance_host.app_instance.hosts_deployment_finished?

      ::Foreman::Logging.logger('foreman_acd').info("All hosts of app (#{@app_instance_host.app_instance.name}) were built. Schedule app configurator...")
      start_acd_app_configurator
    end

    def start_acd_app_configurator
      ForemanTasks.delay(::Actions::ForemanAcd::RunConfigurator,
                         { :start_at => Time.zone.now + RUN_CONFIGURATOR_DELAY },
                         @app_instance_host.app_instance)
    end
  end
end

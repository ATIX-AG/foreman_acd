# frozen_string_literal: true

module ForemanAcd
  # Extends the Host Managed
  module HostManagedExtensions
    extend ActiveSupport::Concern

    def self.prepended(base)
      base.instance_eval do
        before_provision :initiate_acd_app_configurator_after_host_deployment, :if => :deployed_via_acd?
        before_destroy :check_deletable, :prepend => true, :if => :deployed_via_acd?
      end
    end

    def deployed_via_acd?
      find_foreman_host
      @foreman_host.present?
    end

    private

    def check_deletable
      return if @foreman_host.blank?
      ::Foreman::Logging.logger('foreman_acd').warn "Could not delete host '#{name}' because it is used in Applications > App Instances '#{@foreman_host.app_instance.name}'"
      raise _("Could not delete host '%{host_name}' because it is used in Applications > App Instances '%{app_instance_name}'") % {
        :host_name => name, :app_instance_name => @foreman_host.app_instance.name
      }
    end

    def find_foreman_host
      @foreman_host = ForemanAcd::ForemanHost.find_by(:host_id => id)
    end

    def initiate_acd_app_configurator_after_host_deployment
      return if @foreman_host.blank?
      ForemanAcd.initiate_acd_app_configurator(@foreman_host.app_instance)
    end
  end
end

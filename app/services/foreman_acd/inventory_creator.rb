# frozen_string_literal: true

module ForemanAcd
  # inventory creator for application instances
  class InventoryCreator

    delegate :logger, :to => :Rails

    def initialize(app_instance, host_ids)
      @app_instance = app_instance
      @host_ids = host_ids
    end

    # TODO: this might be part of the smart proxy plugin.
    def create_inventory
      inventory = {}
      inventory['all'] = {}

      inventory['all'] = { 'vars' => inventory_all_vars } unless @app_instance.ansible_vars_all.nil? || @app_instance.ansible_vars_all.empty?

      services = JSON.parse(@app_instance.app_definition.services)
      app_hosts = filtered_hosts

      children = {}
      app_hosts.each do |host_data|
        if host_data['foreman_host_id'].nil?
          logger.warn "Ignore host #{host_data['hostname']} because no foreman host id could be found. Is the host not provisioned yet?"
          next
        end

        service_id = host_data['service'].to_i
        host_service = services.select { |s| s['id'] == service_id }.first
        ansible_group = host_service['ansibleGroup']

        unless children.has_key?(host_service['ansibleGroup'])
          children[ansible_group] = { 'hosts' => {} }
        end

        ansible_vars = host_data['ansibleParameters'].map { |v| { v['name'] => v['value'] } }.reduce({}, :merge!)

        # in case there is no ansible_user defined, set "root" as default.
        unless ansible_vars.has_key?('ansible_user')
          ansible_vars['ansible_user'] = 'root'
        end

        children[ansible_group]['hosts'][get_fqdn(host_data['foreman_host_id'])] = ansible_vars
      end
      inventory['all']['children'] = children
      inventory
    end

    private
    def inventory_all_vars
      JSON.parse(@app_instance.ansible_vars_all).map do |a|
        { a['name'] => a['value'] }
      end.reduce({}, :merge!)
    end

    def get_fqdn(host_id)
      Host.find(host_id)&.name
    end

    def filtered_hosts
      JSON.parse(@app_instance.hosts).select{ |h| h&.key?('foreman_host_id') && @host_ids.include?(h['foreman_host_id']) }
    end
  end
end
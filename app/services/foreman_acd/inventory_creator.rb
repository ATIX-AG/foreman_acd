# frozen_string_literal: true

module ForemanAcd
  # inventory creator for application instances
  class InventoryCreator

    def initialize(app_instance)
      @app_instance = app_instance
    end

    # TODO: this might be part of the smart proxy plugin.
    def create_inventory
      inventory = {}
      inventory['all'] = {}

      inventory['all'] = { 'vars' => inventory_all_vars } unless @app_instance.ansible_gv_all.nil? || @app_instance.ansible_gv_all.empty?

      services = JSON.parse(@app_instance.app_definition.services)
      app_hosts = JSON.parse(@app_instance.hosts)

      children = {}
      app_hosts.each do |host_data|
        service_id = host_data['service'].to_i
        host_service = services.select { |s| s['id'] == service_id }.first
        ansible_group = host_service['ansibleGroup']

        unless children.has_key?(host_service['ansibleGroup'])
          children[ansible_group] = { 'hosts' => {} }
        end

        ansible_vars = host_data['ansibleParameters'].map { |v| { v['name'] => v['value'] } }.reduce({}, :merge!)
        children[ansible_group]['hosts'][get_fqdn(host_data['hostname'])] = ansible_vars
      end
      inventory['all']['children'] = children

      inventory
    end

    private
    def inventory_all_vars
      JSON.parse(@app_instance.ansible_gv_all).map do |a|
        { a['name'] => a['value'] }
      end.reduce({}, :merge!)
    end

    # TODO this need to return the hostname which depends on the smart proxy / domain the host uses
    def get_fqdn(hostname)
      hostname
    end
  end
end

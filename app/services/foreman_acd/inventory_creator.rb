# frozen_string_literal: true

module ForemanAcd
  # inventory creator for application instances
  class InventoryCreator
    delegate :logger, :to => :Rails

    def initialize(app_instance, foreman_hosts)
      @app_instance = app_instance
      @foreman_hosts = foreman_hosts
    end

    # TODO: this might be part of the smart proxy plugin.
    def create_inventory
      inventory = {}
      inventory['all'] = {}

      inventory['all'] = { 'vars' => inventory_all_vars } if @app_instance.ansible_vars_all.present?

      services = JSON.parse(@app_instance.app_definition.services)

      children = {}
      @foreman_hosts.each do |foreman_host|
        if foreman_host.host_id.nil?
          logger.warn "Ignore host #{foreman_h.hostname} because no foreman host id could be found. Is the host not provisioned yet?"
          next
        end

        service_id = foreman_host.service.to_i
        host_service = services.find { |s| s['id'] == service_id }
        ansible_group = host_service['ansibleGroup']

        children[ansible_group] = { 'hosts' => {} } unless children.key?(host_service['ansibleGroup'])

        ansible_vars = JSON.parse(foreman_host.ansibleParameters).map { |v| { v['name'] => get_param_value(foreman_host.host, v['value']) } }.reduce({}, :merge!)

        # in case there is no ansible_user defined, set "root" as default.
        ansible_vars['ansible_user'] = 'root' unless ansible_vars.key?('ansible_user')
        ansible_vars['ansible_ssh_private_key_file'] = ansible_ssh_private_key(foreman_host.host)

        children[ansible_group]['hosts'][foreman_host.host.name] = ansible_vars
      end
      inventory['all']['children'] = children
      inventory
    end

    private

    def get_param_value(host, value)
      search_param = value.match(/PARAM\[([^\s]*)\]/)
      return value if search_param.nil?

      resolved_value = host.host_param(search_param[1])
      logger.warn "Could not resolve ansible host param value #{value} for host #{host}" if resolved_value.nil?

      resolved_value
    end

    def ansible_ssh_private_key(host)
      ansible_private_file = host_setting(host, 'ansible_ssh_private_key_file')
      ansible_private_file unless ansible_private_file.empty?
    end

    def host_setting(host, setting)
      host.params[setting] || Setting[setting]
    end

    def inventory_all_vars
      JSON.parse(@app_instance.ansible_vars_all).map do |a|
        { a['name'] => a['value'] }
      end.reduce({}, :merge!)
    end
  end
end

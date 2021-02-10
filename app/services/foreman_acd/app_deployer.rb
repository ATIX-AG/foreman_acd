# frozen_string_literal: true

module ForemanAcd
  # application instances deployer
  class AppDeployer
    delegate :logger, :to => :Rails

    def initialize(app_instance)
      @app_instance = app_instance
    end

    def deploy
      services = JSON.parse(@app_instance.app_definition.services)

      @app_instance.foreman_hosts.each do |foreman_host|
        service_data = services.select { |k| k['id'] == foreman_host.service.to_i }.first
        host_params = set_host_params(foreman_host, service_data)

        host = if foreman_host.host.blank?
                 nil
               else
                 foreman_host.host
               end

        if host.blank?
          params = host_attributes(host_params)
          logger.info("Host creation parameters for #{foreman_host.hostname}:\n#{params}\n")
          host = Host.new(params)
        else
          logger.info("Update parameters and re-deploy host #{foreman_host.hostname}")
          host.attributes = host_attributes(host_params, host)
          host.setBuild
          host.power.reset
        end

        # REMOVE ME (but very nice for testing)
        # host.mac = "00:11:22:33:44:55"

        apply_compute_profile(host)
        host.suggest_default_pxe_loader
        host.save

        # save the foreman host id
        foreman_host.update(:host_id => host.id)
      rescue StandardError => e
        logger.error("Failed to initiate host creation: #{e.class}: #{e.message}\n#{e.backtrace.join($INPUT_RECORD_SEPARATOR)}")
      end

      # TODO make sure to run the async_task only, if all host objects were created.
      # ... maybe it would be better to put this into a task which then can "rollback"

      logger.info("Run async foreman task to deploy hosts")
      ForemanTasks.async_task(::Actions::ForemanAcd::DeployAllHosts, @app_instance)
    end

    private

    # Copied from foreman/app/controllers/api/v2/hosts_controller.rb
    def apply_compute_profile(host)
      host.apply_compute_profile(InterfaceMerge.new(:merge_compute_attributes => true))
      host.apply_compute_profile(ComputeAttributeMerge.new)
    end

    # Copied from foreman/app/controllers/api/v2/hosts_controller.rb
    def host_attributes(params, host = nil)
      return {} if params.nil?

      params = params.deep_clone
      if params[:interfaces_attributes]
        # handle both hash and array styles of nested attributes
        params[:interfaces_attributes] = params[:interfaces_attributes].values if params[:interfaces_attributes].is_a?(Hash) || params[:interfaces_attributes].is_a?(ActionController::Parameters)
        # map interface types
        params[:interfaces_attributes] = params[:interfaces_attributes].map do |nic_attr|
          interface_attributes(nic_attr, :allow_nil_type => host.nil?)
        end
      end
      params = host.apply_inherited_attributes(params) if host
      params
    end

    # Copied from foreman/app/controllers/api/v2/hosts_controller.rb
    def interface_attributes(params, allow_nil_type: false)
      params[:type] = InterfaceTypeMapper.map(params[:type]) if params.key?(:type) || allow_nil_type
      params
    end

    def hardcoded_params
      result = {}
      result['managed'] = true
      result['enabled'] = true
      result['compute_attributes'] = { 'start' => '1' }
      result['host_parameters_attributes'] = []
      result
    end

    def set_host_params(foreman_host, service_data)
      result = hardcoded_params
      result['name'] = foreman_host.hostname
      result['hostgroup_id'] = service_data['hostgroup']

      JSON.parse(foreman_host.foremanParameters) do |param|
        case param['type']

        when 'computeprofile'
          result['compute_profile_id'] = param['value']

        when 'domain'
          result['domain_id'] = param['value']

        when 'hostparam'
          result['host_parameters_attributes'].push(:name => param['name'], :value => param['value'])

        when 'ip'
          result['ip'] = param['value']

        when 'lifecycleenv'
          result['content_facet_attributes'] = { 'lifecycle_environment_id' => param['value'] }

        when 'ptable'
          result['ptable_id'] = param['value']

        when 'puppetenv'
          result['environment_id'] = param['value']

        when 'password'
          result['root_pass'] = param['value']

        end
      end
      result
    end
  end
end

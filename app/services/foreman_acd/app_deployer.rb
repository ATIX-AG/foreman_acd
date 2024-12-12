# frozen_string_literal: true

module ForemanAcd
  # application instances deployer
  class AppDeployer
    delegate :logger, :to => :Rails

    def initialize(app_instance)
      @app_instance = app_instance
    end

    def deploy(safe_deploy)
      output = []
      services = JSON.parse(@app_instance.app_definition.services)
      all_hosts = []

      foreman_hosts = if safe_deploy
                        @app_instance.foreman_hosts.find(safe_deploy)
                      else
                        @app_instance.foreman_hosts
                      end

      foreman_hosts.each do |foreman_host|
        service_data = services.find { |k| k['id'] == foreman_host.service.to_i }

        # Handle already deployed hosts
        if foreman_host.existing_host?
          domain = Hostgroup.find(service_data['hostgroup']).domain.name
          fqdn = "#{foreman_host.hostname}.#{domain}"
          h =  Host.find_by(:name => fqdn)
          foreman_host.update!(:host_id => h.id)
          next
        end

        host_params = set_host_params(foreman_host, service_data)
        host = foreman_host.host.presence

        is_rebuild = false

        if host.blank?
          params = host_attributes(host_params)
          log_params = params.dup
          log_params['root_pass'] = '****' if log_params.key?('root_pass')
          msg = "Host creation parameters for #{foreman_host.hostname}:\n#{log_params}\n"
          logger.info(msg)
          output << msg
          host = Host.new(params)
        else
          msg = "Update parameters and re-deploy host #{foreman_host.hostname}"
          logger.info(msg)
          output << msg
          host.attributes = host_attributes(host_params, host)
          is_rebuild = true
        end

        # REMOVE ME (but very nice for testing)
        # prng = Random.new
        # x = prng.rand(100)
        # y = prng.rand(100)
        # host.mac = "00:11:22:33:#{x}:#{y}"

        apply_compute_profile(host)
        host.suggest_default_pxe_loader

        all_hosts << OpenStruct.new(:foreman_host => foreman_host, :host => host, :rebuild => is_rebuild)
      end

      # do this in a second step, so that we get the progress report for all
      all_hosts.each do |os_host|
        # Save the host -> will initiate the deployment
        os_host.host.save!
        msg = "Saved and initiated/updated host #{os_host.foreman_host.hostname}"
        logger.info(msg)
        output << msg

        os_host.host.power.reset if os_host.rebuild

        # save the foreman host id
        os_host.foreman_host.update!(:host_id => os_host.host.id)

        progress_report = Rails.cache.fetch(os_host.host.progress_report_id)
        os_host.foreman_host.update!(:last_progress_report => progress_report)
        if progress_report.empty?
          msg = "Progress report for #{os_host.foreman_host.hostname} is empty!"
          output << msg
        end
      end

      # Try to start the configuration, too. In case of a app instance including only already deployed hosts
      # this would start the configuration job then.
      ForemanAcd.initiate_acd_app_configurator(@app_instance)

      output
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
      result['build'] = true
      result['compute_attributes'] = { 'start' => '1' }
      result['enabled'] = true
      result['host_parameters_attributes'] = []
      result['managed'] = true
      result
    end

    def set_host_params(foreman_host, service_data)
      result = hardcoded_params
      result['name'] = foreman_host.hostname
      result['hostgroup_id'] = service_data['hostgroup']

      JSON.parse(foreman_host.foremanParameters).each do |param|
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

# frozen_string_literal: true

module ForemanAcd
  # application instances deployer
  class AppDeployer

    delegate :logger, :to => :Rails
    attr_reader :deploy_hosts

    def initialize(app_instance)
      @app_instance = app_instance
      @deploy_hosts = []
    end

    def deploy
      services = JSON.parse(@app_instance.app_definition.services)
      app_hosts = @app_instance.hosts

      app_hosts.each do |host_data|
        begin
          service_data = services.select { |k| k['id'] == host_data['service'].to_i }.first
          host_params = set_host_params(host_data, service_data)

          host = nil
          if host_data.has_key?('foreman_host_id')
            logger.debug("Try to find host with id #{host_data['foreman_host_id']}")
            begin
              host = Host.find(host_data['foreman_host_id'])
            rescue ActiveRecord::RecordNotFound
              logger.info("Host with id #{host_data['foreman_host_id']} couldn\'t be found, create a new one!")
              host = nil
            end
          end

          if host.nil?
            logger.info("Host creation parameters for #{host_data['hostname']}:\n#{params}\n")
            params = host_attributes(host_params)
            host = Host.new(params)
          else
            logger.info("Update parameters and re-deploy host #{host_data['hostname']}")
            host.attributes = host_attributes(host_params, host)
            host.setBuild
            host.power.reset
          end

          # REMOVE ME (but very nice for testing)
          #host.mac = "00:11:22:33:44:55"

          apply_compute_profile(host)
          host.suggest_default_pxe_loader
          host.save

          # save the foreman host id
          host_data['foreman_host_id'] = host.id

          @deploy_hosts.push({ id: host.id, name: host_data['hostname'], hostname: host.hostname, hostUrl: host_path(h), progress_report_id: host.progress_report_id})
        rescue StandardError => e
          logger.error("Failed to initiate host creation: #{e.backtrace.join($INPUT_RECORD_SEPARATOR)}")
        end
      end

      return app_hosts
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
      result['build'] = true
      result['compute_attributes'] = { 'start' => '1' }
      result['host_parameters_attributes'] = []
      result
    end

    def set_host_params(host_data, service_data)
      result = hardcoded_params
      result['name'] = host_data['hostname']
      result['hostgroup_id'] = service_data['hostgroup']

      host_data['parameters'].each do |param|
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

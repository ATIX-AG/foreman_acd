# frozen_string_literal: true

module ForemanAcd
  # application instances configurator
  class AppConfigurator
    delegate :logger, :to => :Rails

    def initialize(app_instance)
      @app_instance = app_instance
    end

    def configure
      job_input = {}
      job_input['application_name'] = @app_instance.name
      job_input['playbook_id'] = @app_instance.app_definition.ansible_playbook.id
      job_input['playbook_file'] = @app_instance.app_definition.ansible_playbook.playfile

      logger.info("Use inventory to configure #{@app_instance.name} with ansible playbook #{@app_instance.app_definition.ansible_playbook.name}")

      begin
        proxy_hosts = {}
        jobs = []

        hosts = @app_instance.acd_foreman_hosts
        proxy_selector = RemoteExecutionProxySelector.new
        hosts.each do |h|
          proxy = proxy_selector.determine_proxy(h, 'SSH')
          proxy_hosts[proxy.name] = [] unless proxy_hosts.key?(proxy.name)
          proxy_hosts[proxy.name] << h.id
        end

        # TODO: just for testing...
        # proxy_hosts = { Host.first.name => [ Host.first.id] }

        # we need to compose multiple jobs. for each proxy one job.
        proxy_hosts.each do |proxy_name, host_names|
          # create the inventory file
          inventory = ForemanAcd::InventoryCreator.new(@app_instance, host_names).create_inventory
          job_input['inventory'] = YAML.dump(inventory)

          composer = JobInvocationComposer.for_feature(
            :run_acd_ansible_playbook,
            [Host.find_by(:name => proxy_name).id],
            job_input.to_hash
          )
          jobs << composer
        end
      rescue StandardError => e
        logger.error("Failed to configure hosts: #{e.class}: #{e.message}\n#{e.backtrace.join($INPUT_RECORD_SEPARATOR)}")
      end
      jobs
    end
  end
end

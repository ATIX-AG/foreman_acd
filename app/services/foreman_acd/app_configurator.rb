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
      job_input[:application_name] = @app_instance.name
      job_input[:playbook_name] = @app_instance.app_definition.ansible_playbook.name
      job_input[:playbook_path] = File.join(@app_instance.app_definition.ansible_playbook.path,
                                            @app_instance.app_definition.ansible_playbook.playfile)

      # TODO should or do we really need it to a file?
      #inventory_file = File.new("/tmp/acd_inventory_file", "w") # we can also use Tempfile.new() but a tempfile will be deleted soon (after transaction finished)
      #inventory_file << inventory.to_yaml
      #inventory_file.close

      logger.info("Use inventory to configure #{@app_instance.name} with ansible playbook #{@app_instance.app_definition.ansible_playbook.name}")

      proxy_hosts = {}
      job_invocations = []

      hosts = @app_instance.foreman_hosts
      proxy_selector = RemoteExecutionProxySelector.new
      hosts.each do |h|
        proxy = proxy_selector.determine_proxy(h, 'SSH')
        unless proxy_hosts.has_key?(proxy.name)
          proxy_hosts[proxy.name] = Array.new
        end
        proxy_hosts[proxy.name] << h.id
      end

      # TODO just for testing...
      proxy_hosts = { Host.first.name => [ Host.first.id] }

      # we need to compose multiple jobs. for each proxy one job.
      proxy_hosts.each do |proxy_name, host_names|
        # create the inventory file
        inventory = ForemanAcd::InventoryCreator.new(@app_instance, host_names).create_inventory
        job_input[:inventory] = YAML.dump(inventory)

        composer = JobInvocationComposer.for_feature(
          :run_acd_ansible_playbook,
          [Host.find_by(:name => proxy_name).id],
          job_input.to_hash
        )
        composer.trigger!
        job_invocations << composer.job_invocation
      end

      job_invocations
    end
  end
end

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
      job_input['playbook_name'] = @app_instance.app_definition.ansible_playbook.name
      job_input['playbook_path'] = File.join(@app_instance.app_definition.ansible_playbook.path,
                                            @app_instance.app_definition.ansible_playbook.playfile)

      # TODO should or do we really need it to a file?
      #inventory_file = File.new("/tmp/acd_inventory_file", "w") # we can also use Tempfile.new() but a tempfile will be deleted soon (after transaction finished)
      #inventory_file << inventory.to_yaml
      #inventory_file.close

      logger.info("Use inventory to configure #{@app_instance.name} with ansible playbook #{@app_instance.app_definition.ansible_playbook.name}")

      begin
        proxy_hosts = {}
        jobs = []

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
        #proxy_hosts = { Host.first.name => [ Host.first.id] }

        # we need to compose multiple jobs. for each proxy one job.
        proxy_hosts.each do |proxy_name, host_names|
          # create the inventory file
          inventory = ForemanAcd::InventoryCreator.new(@app_instance, host_names).create_inventory
          job_input['inventory'] = YAML.dump(inventory)

          # Unfortunately, we can not use "JobInvocationComposer.for_feature" method
          # because then its not possible to the set effective_user
          job = JobTemplate.find(RemoteExecutionFeature.feature('run_acd_ansible_playbook').job_template_id)
          params = {
            :job_category => job.job_category,
            :job_template_id => job.id,
            :targeting_type => 'static_query',
            :search_query => "name = #{proxy_name}",
            :effective_user => 'foreman-proxy',
            :inputs => job_input.to_hash
          }
          composer = JobInvocationComposer.from_api_params(params)
          jobs << composer
        end
      rescue StandardError => e
        logger.error("Failed to configure hosts: #{e.class}: #{e.message}\n#{e.backtrace.join($INPUT_RECORD_SEPARATOR)}")
      end
      jobs
    end
  end
end

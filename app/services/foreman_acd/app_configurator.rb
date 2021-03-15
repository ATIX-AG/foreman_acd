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
        result = OpenStruct.new

        hosts = @app_instance.foreman_hosts

        # Important: This uses the REX Proxy Selector and not
        #  the AcdProxySelection because the AcdProxySelector
        #  does not find the proxy but only return the given
        #  host. This is required because we want to run the
        #  ansible playbook for a group of hosts on the smart proxy.
        #  So the process need to be:
        #  1. get the proxy which is required to connect to host a,b,c
        #  2. run the job on the proxy
        #  In 2. we need to make sure that REX doesn't try to find the
        #  proxy which is necessary to connect to the proxy
        proxy_selector = RemoteExecutionProxySelector.new
        hosts.each do |h|
          begin
            unless h.host
              result.success = false
              result.error = 'App Instance is not deployed'
              return [result, jobs]
            end
            proxy = proxy_selector.determine_proxy(h.host, 'ACD')
            result.success = true
          rescue NoMethodError => e
            result.success = false
            result.error = "#{e}, Install/Update smart-proxies for ACD"
            return [result, jobs]
          end
          proxy_hosts[proxy.name] = [] unless proxy_hosts.key?(proxy.name)
          proxy_hosts[proxy.name] << h
        end

        # TODO: just for testing...
        # proxy_hosts = { Host.first.name => [ Host.first.id] }

        # we need to compose multiple jobs. for each proxy one job.
        proxy_hosts.each do |proxy_name, foreman_hosts|
          # create the inventory file
          inventory = ForemanAcd::InventoryCreator.new(@app_instance, foreman_hosts).create_inventory
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
      [result, jobs]
    end
  end
end

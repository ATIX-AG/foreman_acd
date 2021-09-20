# frozen_string_literal: true

require 'foreman_acd/engine'

# Module required to start the Foreman Rails engine
module ForemanAcd
  RUN_CONFIGURATOR_DELAY = 240

  class << self
    def acd_base_path
      '/var/lib/foreman/foreman_acd/'
    end

    def ansible_playbook_path
      File.join(acd_base_path, 'ansible-playbooks')
    end

    def proxy_setting
      HttpProxy.default_global_content_proxy&.full_url ||
        Setting[:http_proxy]
    end

    def initiate_acd_app_configurator(app_instance)
      return unless app_instance.hosts_deployment_finished?

      ::Foreman::Logging.logger('foreman_acd').info("All hosts of app (#{app_instance.name}) were built. Schedule app configurator...")
      start_acd_app_configurator(app_instance)
    end

    def start_acd_app_configurator(app_instance)
      task = ForemanTasks.delay(::Actions::ForemanAcd::RunConfigurator,
                                { :start_at => Time.zone.now + RUN_CONFIGURATOR_DELAY },
                                app_instance)
      app_instance.update(:initial_configure_task_id => task.id)
    end
  end
end

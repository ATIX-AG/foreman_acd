# frozen_string_literal: true

require 'foreman_remote_execution'
require 'git'

# The ForemanAcd module
module ForemanAcd
  # This engine connects ForemanAcd with Foreman core
  class Engine < ::Rails::Engine
    engine_name 'foreman_acd'

    # Add any db migrations
    initializer 'foreman_acd.load_app_instance_data' do |app|
      ForemanAcd::Engine.paths['db/migrate'].existent.each do |path|
        app.config.paths['db/migrate'] << path
      end
    end

    initializer 'foreman_acd.apipie' do
      Apipie.configuration.checksum_path += ['/acd/api/']
    end

    rake_tasks do
      Rake::Task['db:seed'].enhance do
        ForemanAcd::Engine.load_seed
      end
    end

    initializer 'foreman_acd.register_gettext', :after => :load_config_initializers do
      locale_dir = File.join(File.expand_path('../..', __dir__), 'locale')
      locale_domain = 'foreman_acd'
      Foreman::Gettext::Support.add_text_domain locale_domain, locale_dir
    end

    initializer 'foreman_acd.register_plugin', :before => :finisher_hook do |app|
      app.reloader.to_prepare do
        require 'foreman_acd/plugin'
      end
    end

    initializer 'foreman_acd.register_actions', :before => :finisher_hook do |_app|
      ForemanTasks.dynflow.require!
      action_paths = %W[#{ForemanAcd::Engine.root}/app/lib/actions]
      ForemanTasks.dynflow.config.eager_load_paths.concat(action_paths)
    end

    config.to_prepare do
      ::Taxonomy.include ForemanAcd::TaxonomyExtensions
      ::Host::Managed.prepend ForemanAcd::HostManagedExtensions

      RemoteExecutionProvider.register(:ACD, AcdProvider)
      ForemanAcd.register_rex_feature
    end
  end

  def self.with_katello?
    defined?(::Katello)
  end

  def self.with_remote_execution?
    RemoteExecutionFeature
  rescue StandardError
    false
  end

  def self.register_rex_feature
    return unless ForemanAcd.with_remote_execution?
    RemoteExecutionFeature.register(
      :run_acd_ansible_playbook,
      N_('Run playbook for ACD'),
      {
        :description => N_('Run an Ansible playbook to configure ACD application'),
        :provided_inputs => %w[application_name playbook_name playbook_path inventory_path],
      }
    )
  end
end

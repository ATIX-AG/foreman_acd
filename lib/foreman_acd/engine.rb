# frozen_string_literal: true

require 'foreman_remote_execution'

module ForemanAcd
  # This engine connects ForemanAcd with Foreman core
  class Engine < ::Rails::Engine
    engine_name 'foreman_acd'

    config.autoload_paths += Dir["#{config.root}/app/controllers/foreman_acd/concerns"]
    config.autoload_paths += Dir["#{config.root}/app/helpers"]
    config.autoload_paths += Dir["#{config.root}/app/models/foreman_acd/concerns"]
    config.autoload_paths += Dir["#{config.root}/app/models/parameters"]
    config.autoload_paths += Dir["#{config.root}/app/overrides"]
    config.autoload_paths += Dir["#{config.root}/app/services"]
    config.autoload_paths += Dir["#{config.root}/app/lib"]
    config.autoload_paths += Dir["#{config.root}/lib"]

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

    initializer 'foreman_acd.register_plugin', :before => :finisher_hook do
      require 'foreman_acd/plugin'
    end

    config.to_prepare do
      RemoteExecutionProvider.register(:ACD, AcdProvider)
      ::Taxonomy.include ForemanAcd::TaxonomyExtensions
    end
  end
end

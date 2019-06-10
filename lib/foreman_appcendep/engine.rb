# frozen_string_literal: true

module ForemanAppcendep
  # This engine connects ForemanAppcendep with Foreman core
  class Engine < ::Rails::Engine
    engine_name 'foreman_appcendep'

    config.autoload_paths += Dir["#{config.root}/app/controllers/foreman_appcendep/concerns"]
    config.autoload_paths += Dir["#{config.root}/app/helpers"]
    config.autoload_paths += Dir["#{config.root}/app/models/concerns"]
    config.autoload_paths += Dir["#{config.root}/app/overrides"]
    config.autoload_paths += Dir["#{config.root}/app/services"]
    config.autoload_paths += Dir["#{config.root}/app/lib"]

    # Add any db migrations
    initializer 'foreman_appcendep.load_app_instance_data' do |app|
      ForemanAppcendep::Engine.paths['db/migrate'].existent.each do |path|
        app.config.paths['db/migrate'] << path
      end
    end

    # Include concerns in this config.to_prepare block
    # config.to_prepare do
    #   begin
    #     Host::Managed.send(:include, ForemanAppcendep::HostExtensions)
    #     HostsHelper.send(:include, ForemanAppcendep::HostsHelperExtensions)
    #   rescue StandardError => e
    #     Rails.logger.warn "ForemanAppcendep: skipping engine hook (#{e})"
    #   end
    # end

    rake_tasks do
      Rake::Task['db:seed'].enhance do
        ForemanAppcendep::Engine.load_seed
      end
    end

    initializer 'foreman_appcendep.register_gettext', :after => :load_config_initializers do
      locale_dir = File.join(File.expand_path('../..', __dir__), 'locale')
      locale_domain = 'foreman_appcendep'
      Foreman::Gettext::Support.add_text_domain locale_domain, locale_dir
    end

    initializer 'foreman_appcendep.register_plugin', :before => :finisher_hook do
      require 'foreman_appcendep/plugin'
    end
  end
end

# frozen_string_literal: true

Foreman::Plugin.register :foreman_acd do
  requires_foreman '>= 1.19'

  apipie_documented_controllers ["#{ForemanAcd::Engine.root}/app/controllers/foreman_acd/api/v2/*.rb"]

  # Menus
  divider :top_menu, :parent => :configure_menu, :caption => 'Applications'
  menu :top_menu, :app_definitions,
       :url_hash => { :controller => :'foreman_acd/app_definitions', :action => :index },
       :caption => 'App Definitions',
       :parent => :configure_menu

  menu :top_menu, :app_instances,
       :url_hash => { :controller => :'foreman_acd/app_instances', :action => :index },
       :caption => 'App Instances',
       :parent => :configure_menu

  # Add permissions
  security_block :foreman_acd do
    permission :create_app_definitions,
               { :'foreman_acd/app_definitions' => [:new, :create],
                 :'foreman_acd/api/v2/app_definitions' => [:create] },
               :resource_type => 'ForemanAcd::AppDefinition'

    permission :view_app_definitions,
               { :'foreman_acd/app_definitions' => [:index, :show, :auto_complete_search],
                 :'foreman_acd/api/v2/app_definitions' => [:index, :show] },
               :resource_type => 'ForemanAcd::AppDefinition'

    permission :edit_app_definitions,
               { :'foreman_acd/app_definitions' => [:update, :edit],
                 :'foreman_acd/api/v2/app_definitions' => [:update] },
               :resource_type => 'ForemanAcd::AppDefinition'

    permission :destroy_app_definitions,
               { :'foreman_acd/app_definitions' => [:destroy],
                 :'foreman_acd/api/v2/app_definitions' => [:destroy] },
               :resource_type => 'ForemanAcd::AppDefinition'

    permission :create_app_instances,
               { :'foreman_acd/app_instances' => [:new, :create],
                 :'foreman_acd/api/v2/app_instances' => [:create] },
               :resource_type => 'ForemanAcd::AppInstance'

    permission :view_app_instances,
               { :'foreman_acd/app_instances' => [:index, :show, :auto_complete_search],
                 :'foreman_acd/api/v2/app_instances' => [:index, :show] },
               :resource_type => 'ForemanAcd::AppInstance'

    permission :edit_app_instances,
               { :'foreman_acd/app_instances' => [:update, :edit],
                 :'foreman_acd/api/v2/app_instances' => [:update] },
               :resource_type => 'ForemanAcd::AppInstance'

    permission :destroy_app_instances,
               { :'foreman_acd/app_instances' => [:destroy],
                 :'foreman_acd/api/v2/app_instances' => [:destroy] },
               :resource_type => 'ForemanAcd::AppInstance'

    permission :deploy_app_instances,
               { :'foreman_acd/app_instances' => [:deploy],
                 :'foreman_acd/api/v2/app_instances' => [:deploy] },
               :resource_type => 'ForemanAcd::AppInstance'
  end

  # Manager Role
  role 'Application Centric Deployment Manager', [:create_app_definitions,
                                                  :view_app_definitions,
                                                  :edit_app_definitions,
                                                  :destroy_app_definitions]

  # User Role
  role 'Application Centric Deployment User', [:create_app_instances,
                                               :view_app_instances,
                                               :edit_app_instances,
                                               :destroy_app_instances,
                                               :deploy_app_instances]
end
# frozen_string_literal: true

Foreman::Plugin.register :foreman_appcendep do
  requires_foreman '>= 1.19'

  apipie_documented_controllers ["#{ForemanAppcendep::Engine.root}/app/controllers/foreman_appcendep/api/v2/*.rb"]

  # Menus
  divider :top_menu, :parent => :configure_menu, :caption => 'Application Centric Deployment'
  menu :top_menu, :app_definitions,
       :url_hash => { :controller => :'foreman_appcendep/app_definitions', :action => :index },
       :caption  => 'App Definitions',
       :parent   => :configure_menu

  menu :top_menu, :app_instances,
       :url_hash => { :controller => :'foreman_appcendep/app_instances', :action => :index },
       :caption  => 'App Instances',
       :parent   => :configure_menu

  # Add permissions
  security_block :foreman_appcendep do
    permission :create_app_definitions,
               { :'foreman_appcendep/app_definitions' => [:new, :create],
                 :'foreman_appcendep/api/v2/app_definitions' => [:create] },
               :resource_type => 'ForemanAppcendep::AppDefinition'

    permission :view_app_definitions,
               { :'foreman_appcendep/app_definitions' => [:index, :show, :auto_complete_search],
                 :'foreman_appcendep/api/v2/app_definitions' => [:index, :show] },
               :resource_type => 'ForemanAppcendep::AppDefinition'

    permission :edit_app_definitions,
               { :'foreman_appcendep/app_definitions' => [:update, :edit],
                 :'foreman_appcendep/api/v2/app_definitions' => [:update] },
               :resource_type => 'ForemanAppcendep::AppDefinition'

    permission :destroy_app_definitions,
               { :'foreman_appcendep/app_definitions' => [:destroy],
                 :'foreman_appcendep/api/v2/app_definitions' => [:destroy] },
               :resource_type => 'ForemanAppcendep::AppDefinition'

    permission :create_app_instances,
               { :'foreman_appcendep/app_instances' => [:new, :create],
                 :'foreman_appcendep/api/v2/app_instances' => [:create] },
               :resource_type => 'ForemanAppcendep::AppInstance'

    permission :view_app_instances,
               { :'foreman_appcendep/app_instances' => [:index, :show, :auto_complete_search],
                 :'foreman_appcendep/api/v2/app_instances' => [:index, :show] },
               :resource_type => 'ForemanAppcendep::AppInstance'

    permission :edit_app_instances,
               { :'foreman_appcendep/app_instances' => [:update, :edit],
                 :'foreman_appcendep/api/v2/app_instances' => [:update] },
               :resource_type => 'ForemanAppcendep::AppInstance'

    permission :destroy_app_instances,
               { :'foreman_appcendep/app_instances' => [:destroy],
                 :'foreman_appcendep/api/v2/app_instances' => [:destroy] },
               :resource_type => 'ForemanAppcendep::AppInstance'
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
                                               :destroy_app_instances]
end

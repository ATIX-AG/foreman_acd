# frozen_string_literal: true

Foreman::Plugin.register :foreman_acd do
  requires_foreman '>= 2.1'

  apipie_documented_controllers ["#{ForemanAcd::Engine.root}/app/controllers/foreman_acd/api/v2/*.rb"]

  # Menus
  sub_menu :top_menu, :application, :caption => N_('Applications'), :after => :hosts_menu, :icon => 'pficon pficon-integration' do
    menu :top_menu, :ansible_playbooks,
         :url_hash => { :controller => :'foreman_acd/ansible_playbooks', :action => :index },
         :caption => 'Ansible Playbooks'

    menu :top_menu, :app_definitions,
         :url_hash => { :controller => :'foreman_acd/app_definitions', :action => :index },
         :caption => 'App Definitions'

    menu :top_menu, :app_instances,
         :url_hash => { :controller => :'foreman_acd/app_instances', :action => :index },
         :caption => 'App Instances'
  end

  # Add permissions
  security_block :foreman_acd do
    permission :create_ansible_playbooks,
               { :'foreman_acd/ansible_playbooks' => [:new, :create],
                 :'foreman_acd/api/v2/ansible_playbooks' => [:create] },
               :resource_type => 'ForemanAcd::AnsiblePlaybook'

    permission :view_ansible_playbooks,
               { :'foreman_acd/ansible_playbooks' => [:index, :show, :auto_complete_search],
                 :'foreman_acd/api/v2/ansible_playbooks' => [:index, :show] },
               :resource_type => 'ForemanAcd::AnsiblePlaybook'

    permission :edit_ansible_playbooks,
               { :'foreman_acd/ansible_playbooks' => [:update, :edit],
                 :'foreman_acd/api/v2/ansible_playbooks' => [:update] },
               :resource_type => 'ForemanAcd::AnsiblePlaybook'

    permission :destroy_ansible_playbooks,
               { :'foreman_acd/ansible_playbooks' => [:destroy],
                 :'foreman_acd/api/v2/ansible_playbooks' => [:destroy] },
               :resource_type => 'ForemanAcd::AnsiblePlaybook'

    permission :import_vars_ansible_playbooks,
               { :'foreman_acd/ansible_playbooks' => [:import_vars],
                 :'foreman_acd/api/v2/ansible_playbooks' => [:import_vars] },
               :resource_type => 'ForemanAcd::AnsiblePlaybook'

    permission :grab_ansible_playbooks,
               { :'foreman_acd/api/v2/ansible_playbooks' => [:grab] },
               :resource_type => 'ForemanAcd::AnsiblePlaybook'

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

    permission :export_app_definitions,
               { :'foreman_acd/app_definitions' => [:export],
                 :'foreman_acd/api/v2/app_definitions' => [:export] },
               :resource_type => 'ForemanAcd::AppDefinition'

    permission :import_app_definitions,
               { :'foreman_acd/app_definitions' => [:import],
                 :'foreman_acd/api/v2/app_definitions' => [:import] },
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

    permission :report_app_instances,
               { :'foreman_acd/app_instances' => [:report],
                 :'foreman_acd/api/v2/app_instances' => [:report] },
               :resource_type => 'ForemanAcd::AppInstance'

    permission :new_remote_execution,
               { :'foreman_acd/remote_execution' => [:new] },
               :resource_type => 'ForemanAcd::RemoteExecution'

    permission :create_remote_execution,
               { :'foreman_acd/remote_execution' => [:create] },
               :resource_type => 'ForemanAcd::RemoteExecution'
  end

  # Manager Role
  role 'Application Centric Deployment Manager', [:create_ansible_playbooks, :view_ansible_playbooks, :edit_ansible_playbooks,
                                                  :destroy_ansible_playbooks,
                                                  :import_vars_ansible_playbooks, :grab_ansible_playbooks,
                                                  :create_app_definitions, :view_app_definitions, :edit_app_definitions,
                                                  :destroy_app_definitions,
                                                  :export_app_definitions, :import_app_definitions,
                                                  :create_app_instances, :view_app_instances, :edit_app_instances,
                                                  :destroy_app_instances,
                                                  :deploy_app_instances,
                                                  :new_remote_execution, :create_remote_execution,
                                                  :report_app_instances]

  # User Role
  role 'Application Centric Deployment User', [:create_app_instances, :view_app_instances, :edit_app_instances,
                                               :destroy_app_instances,
                                               :deploy_app_instances,
                                               :new_remote_execution, :create_remote_execution,
                                               :report_app_instances]

  add_all_permissions_to_default_roles

  RemoteExecutionFeature.register(
    :run_acd_ansible_playbook,
    N_('Run playbook for ACD'),
    {
      :description => N_('Run an Ansible playbook to configure ACD application'),
      :provided_inputs => %w[application_name playbook_name playbook_path inventory_path]
    }
  )
end

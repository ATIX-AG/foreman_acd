# frozen_string_literal: true

# Controller to create JSON data to be used in react app
class UiAcdController < ::Api::V2::BaseController
  def app
    @app_data = {}
    app_definition = ForemanAcd::AppDefinition.find(params[:id])
    @app_data['app_definition'] = app_definition
  end

  def foreman_data
    @foreman_data = collect_foreman_data(params['id'])
  end

  def ansible_data
    @ansible_data = collect_ansible_data(params['id'])
  end

  def validate_hostname
    @host_validation = hostname_duplicate?(params['appDefId'].to_i, params['serviceId'].to_i, params['hostname'])
  end

  def action_permission
    case params[:action]
    when 'app', 'foreman_data', 'ansible_data', 'validate_hostname'
      :view
    else
      super
    end
  end

  private

  def collect_foreman_data(hostgroup_id)
    hg = Hostgroup.find(hostgroup_id)
    fdata = OpenStruct.new(
      :environments => Environment.all,
      :lifecycle_environments => Katello::KTEnvironment.all,
      :domains => Domain.all,
      :computeprofiles => ComputeProfile.all,
      :hostgroup_id => hg.id,
      :ptables => hg&.operatingsystem&.ptables
    )
    fdata
  end

  def collect_ansible_data(playbook_id)
    ForemanAcd::AnsiblePlaybook.find(playbook_id).as_unified_structobj
  end

  def hostname_duplicate?(app_def_id, service_id, hostname)
    app_definition = ForemanAcd::AppDefinition.find(app_def_id)
    service_data = JSON.parse(app_definition.services).select { |k| k['id'] == service_id }.first
    domain_name = Hostgroup.find(service_data['hostgroup']).domain.name
    validation_hostname = "#{hostname}.#{domain_name}"

    vdata = OpenStruct.new(
      :hostname => hostname,
      :fqdn => validation_hostname,
      :result => Host.find_by(:name => validation_hostname).nil?
    )
    vdata
  end
end

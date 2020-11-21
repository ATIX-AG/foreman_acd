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
end

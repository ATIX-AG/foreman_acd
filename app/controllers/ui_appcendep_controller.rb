class UiAppcendepController < ::Api::V2::BaseController

  def app
    @app_data = {}
    app_definition = ForemanAppcendep::AppDefinition.find(params[:id])
    @app_data['app_definition'] = app_definition
    @app_data['fdata'] = collect_fdata(app_definition.hostgroup_id)
  end

  def fdata
    @fdata = collect_fdata(params['id'])
  end

  private
  def collect_fdata(hostgroup_id)
    hg = Hostgroup.find(hostgroup_id)
    fdata = OpenStruct.new({
      :environments => Environment.all,
      :domains => Domain.all,
      :computeprofiles => ComputeProfile.all,
      :hostgroup_id => hg.id,
      :ptables => hg.operatingsystem.ptables,
    })

    #:lifecycle_environments => Katello::KTEnvironment.all

    fdata
  end
end

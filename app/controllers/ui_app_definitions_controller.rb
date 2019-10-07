class UiAppDefinitionsController < ::Api::V2::BaseController

  def show
    @app_definition = resource_class.find(params[:id])
  end

  def resource_class
    ForemanAppcendep::AppDefinition
  end
end

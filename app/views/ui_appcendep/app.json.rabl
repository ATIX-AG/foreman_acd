# frozen_string_literal: true

child @app_data['app_definition'] => :app_definition do
  extends 'ui_appcendep/app_definition'
end

child @app_data['fdata'] => :fdata do
  extends 'ui_appcendep/fdata'
end

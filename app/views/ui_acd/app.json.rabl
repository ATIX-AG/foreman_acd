# frozen_string_literal: true

child @app_data['app_definition'] => :app_definition do
  extends 'ui_acd/app_definition'
end

child @app_data['foreman_data'] => :foreman_data do
  extends 'ui_acd/foreman_data'
end

child @app_data['ansible_data'] => :ansible_data do
  extends 'ui_acd/ansible_data'
end

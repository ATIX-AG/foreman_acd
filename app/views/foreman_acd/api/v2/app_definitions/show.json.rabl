object @app_definition

extends 'foreman_acd/api/v2/app_definitions/base'

node do |app_definition|
  partial("api/v2/taxonomies/children_nodes", :object => app_definition)
end

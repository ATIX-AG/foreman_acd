# frozen_string_literal: true

module ForemanAcd
  module Concerns
    # Parameters for AppDefinitions
    module AppDefinitionParameters
      extend ActiveSupport::Concern

      class_methods do
        def app_definition_params_filter
          Foreman::ParameterFilter.new(::ForemanAcd::AppDefinition).tap do |filter|
            filter.permit(:name, :description, :acd_ansible_playbook_id, :services, :ansible_vars_all, :location_ids => [], :organization_ids => [])
          end
        end
      end

      def app_definition_params
        param_name = parameter_filter_context.api? ? 'app_definition' : 'foreman_acd_app_definition'
        self.class.app_definition_params_filter.filter_params(params, parameter_filter_context, param_name)
      end
    end
  end
end

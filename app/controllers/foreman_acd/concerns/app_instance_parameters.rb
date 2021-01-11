# frozen_string_literal: true

module ForemanAcd
  module Concerns
    # Parameters for AppInstances
    module AppInstanceParameters
      extend ActiveSupport::Concern

      class_methods do
        def app_instance_params_filter
          Foreman::ParameterFilter.new(::ForemanAcd::AppInstance).tap do |filter|
            filter.permit(:name, :app_definition_id, :description, :hosts, :ansible_vars_all, :organization_id, :location_id)
          end
        end
      end

      def app_instance_params
        param_name = parameter_filter_context.api? ? 'app_instance' : 'foreman_acd_app_instance'
        self.class.app_instance_params_filter.filter_params(params, parameter_filter_context, param_name)
      end
    end
  end
end

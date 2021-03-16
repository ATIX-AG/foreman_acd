# frozen_string_literal: true

module ForemanAcd
  module Concerns
    # Parameters for AnsiblePlaybooks
    module AnsiblePlaybookParameters
      extend ActiveSupport::Concern

      class_methods do
        def ansible_playbook_params_filter
          Foreman::ParameterFilter.new(::ForemanAcd::AnsiblePlaybook).tap do |filter|
            filter.permit(:name, :description, :scm_type, :path, :git_commit, :git_url, :playfile, :location_ids => [], :organization_ids => [])
          end
        end
      end

      def ansible_playbook_params
        param_name = parameter_filter_context.api? ? 'ansible_playbook' : 'foreman_acd_ansible_playbook'
        self.class.ansible_playbook_params_filter.filter_params(params, parameter_filter_context, param_name)
      end
    end
  end
end

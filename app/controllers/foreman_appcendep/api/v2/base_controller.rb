# frozen_string_literal: true

module ForemanAppcendep
  module Api
    module V2
      # Base Controller for all Appcendep API controllers
      class BaseController < ::Api::V2::BaseController
        resource_description do
          resource_id 'foreman_appcendep'
          api_version 'v2'
          api_base_url '/appcendep/api'
        end
      end
    end
  end
end

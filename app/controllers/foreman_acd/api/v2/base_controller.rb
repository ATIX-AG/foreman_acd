# frozen_string_literal: true

module ForemanAcd
  module Api
    module V2
      # Base Controller for all Acd API controllers
      class BaseController < ::Api::V2::BaseController
        resource_description do
          resource_id 'foreman_acd'
          api_version 'v2'
          api_base_url '/acd/api'
        end
      end
    end
  end
end

# frozen_string_literal: true

module ForemanAppcendep
  # Base controller for all controllers
  class ApplicationController < ::ApplicationController
    def resource_class
      "ForemanAppcendeAppcendep::#{controller_name.singularize.classify}".constantize
    end
  end
end

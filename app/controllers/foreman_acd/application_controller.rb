# frozen_string_literal: true

module ForemanAcd
  # Base controller for all controllers
  class ApplicationController < ::ApplicationController
    def resource_class
      "ForemanAcd::#{controller_name.singularize.classify}".constantize
    end
  end
end

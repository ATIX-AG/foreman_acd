# frozen_string_literal: true

module ForemanAppcendep
  # Application Definition
  class AppDefinition < ApplicationRecord
    include Authorizable
    extend FriendlyId
    friendly_id :name

    def self.humanize_class_name(_name = nil)
      _('App Definition')
    end

    def self.permission_name
      'app_definitions'
    end
  end
end

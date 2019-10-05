# frozen_string_literal: true

module ForemanAppcendep
  # Application Definition
  class AppDefinition < ApplicationRecord
    include Authorizable
    extend FriendlyId
    friendly_id :name

    belongs_to :hostgroup, :class_name => '::Hostgroup'
    has_many :app_instances, inverse_of: :app_definition
    scoped_search :on => :name

    def self.humanize_class_name(_name = nil)
      _('App Definition')
    end

    def self.permission_name
      'app_definitions'
    end
  end
end

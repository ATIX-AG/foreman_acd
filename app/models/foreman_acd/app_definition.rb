# frozen_string_literal: true

module ForemanAcd
  # Application Definition
  class AppDefinition < ApplicationRecord
    include Authorizable
    extend FriendlyId
    friendly_id :name

    validates :name, :presence => true, :uniqueness => true
    has_many :app_instances, :inverse_of => :app_definition, :dependent => :destroy
    scoped_search :on => :name

    def self.humanize_class_name(_name = nil)
      _('App Definition')
    end

    def self.permission_name
      'app_definitions'
    end
  end
end

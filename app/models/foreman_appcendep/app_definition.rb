# frozen_string_literal: true

module ForemanAppcendep
  # Application Definition
  class AppDefinition < ApplicationRecord
    include Authorizable
    extend FriendlyId
    friendly_id :name

    belongs_to :hostgroup, :class_name => '::Hostgroup'
    has_many :app_instances, inverse_of: :app_definition
    has_many :application_parameters, :dependent => :destroy, :foreign_key => :reference_id, :inverse_of => :application
    has_many :parameters, :dependent => :destroy, :foreign_key => :reference_id, :inverse_of => :application, :class_name => '::ApplicationParameter'

    scoped_search :on => :name

    def self.humanize_class_name(_name = nil)
      _('App Definition')
    end

    def self.permission_name
      'app_definitions'
    end
  end
end

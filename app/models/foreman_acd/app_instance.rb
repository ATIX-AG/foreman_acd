# frozen_string_literal: true

module ForemanAcd
  # Application Instance
  class AppInstance < ApplicationRecord
    include Authorizable
    extend FriendlyId
    friendly_id :name
    validates :name, :presence => true, :uniqueness => true
    belongs_to :app_definition, :inverse_of => :app_instances
    scoped_search :on => :name

    def self.humanize_class_name(_name = nil)
      _('App Instance')
    end

    def self.permission_name
      'app_instances'
    end
  end
end
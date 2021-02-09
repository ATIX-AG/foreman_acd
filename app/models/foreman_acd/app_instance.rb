# frozen_string_literal: true

module ForemanAcd
  # Application Instance
  class AppInstance < ApplicationRecord
    include Authorizable
    extend FriendlyId
    friendly_id :name
    validates :name, :presence => true, :uniqueness => true
    belongs_to :app_definition, :inverse_of => :app_instances
    belongs_to :organization
    validates :organization, :presence => true
    belongs_to :location
    has_many :foreman_hosts, :inverse_of => :app_instance, :dependent => :destroy
    validates :location, :presence => true
    scoped_search :on => :name
    default_scope -> { order('app_instances.name') }
    attr_accessor :hosts

    def self.humanize_class_name(_name = nil)
      _('App Instance')
    end

    def self.permission_name
      'app_instances'
    end
  end
end

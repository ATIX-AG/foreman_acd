# frozen_string_literal: true

module ForemanAcd
  # Foreman Host
  class ForemanHost < ApplicationRecord
    include Authorizable
    validates :hostname, :presence => true
    belongs_to :app_instance, :inverse_of => :foreman_hosts
    belongs_to :host, :class_name => 'Foreman::Host::Managed', :inverse_of => :foreman_hosts
    scoped_search :on => :hostname
    default_scope -> { order('foreman_hosts.hostname') }

    def self.humanize_class_name(_name = nil)
      _('Foreman Host')
    end

    def self.permission_name
      'foreman_hosts'
    end
  end
end

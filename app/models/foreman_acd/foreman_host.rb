# frozen_string_literal: true

module ForemanAcd
  # Foreman Host
  class ForemanHost < ApplicationRecord
    include Authorizable

    self.table_name = 'acd_foreman_hosts'
    validates :hostname, :presence => true
    belongs_to :app_instance, :inverse_of => :foreman_hosts
    belongs_to :host, :class_name => '::Host::Managed'
    scoped_search :on => :hostname
    default_scope -> { order('acd_foreman_hosts.hostname') }

    def self.humanize_class_name(_name = nil)
      _('Foreman Host')
    end

    def self.permission_name
      'foreman_hosts'
    end
  end
end

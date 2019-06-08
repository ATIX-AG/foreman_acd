# frozen_string_literal: true

module ForemanAppcendep
  # Application Instance
  class AppInstance < ApplicationRecord
    include Authorizable
    extend FriendlyId
    friendly_id :name

    def self.humanize_class_name(_name = nil)
      _('App Instance')
    end

    def self.permission_name
      'app_instances'
    end
  end
end

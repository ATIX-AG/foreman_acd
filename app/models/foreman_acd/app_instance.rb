# frozen_string_literal: true

module ForemanAcd
  # Application Instance
  class AppInstance < ApplicationRecord
    include Authorizable
    include ForemanTasks::Concerns::ActionSubject
    extend FriendlyId
    friendly_id :name
    include Parameterizable::ByIdName

    self.table_name = 'acd_app_instances'
    belongs_to :last_deploy_task, :class_name => 'ForemanTasks::Task'
    validates :name, :presence => true, :uniqueness => true
    validates :app_definition, :presence => true
    belongs_to :app_definition, :inverse_of => :app_instances
    belongs_to :organization
    validates :organization, :presence => true
    belongs_to :location
    validates :location, :presence => true
    has_many :foreman_hosts, :inverse_of => :app_instance, :dependent => :destroy
    scoped_search :on => :name
    default_scope -> { order('acd_app_instances.name') }
    attr_accessor :hosts

    def self.humanize_class_name(_name = nil)
      _('App Instance')
    end

    def self.permission_name
      'app_instances'
    end

    def clean_all_hosts
      remember_host_ids = foreman_hosts.map(&:host_id)

      # Clean the app instance association first
      foreman_hosts.update_all(:host_id => nil)

      # Remove all hosts afterwards
      delete_hosts(remember_host_ids)
    end

    def clean_hosts_by_id(ids = [])
      # Clean the app instance association first
      foreman_hosts.where(:host_id => ids).update_all(:host_id => nil)

      # Remove all hosts afterwards
      delete_hosts(ids)
    end

    def delete_hosts(ids = [])
      return if ids.empty?
      ids.each do |host_id|
        h = ::Host.find(host_id) unless host_id.nil?
        if h
          Katello::RegistrationManager.unregister_host(h, :unregistering => false) if ForemanAcd.with_katello?
          h.destroy
        end
      end
    end
  end
end

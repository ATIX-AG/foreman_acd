# frozen_string_literal: true

module ForemanAcd
  # Ansible playbook
  class AnsiblePlaybook < ApplicationRecord
    include Authorizable
    extend FriendlyId
    friendly_id :name

    self.table_name = 'acd_ansible_playbooks'
    has_many :app_definitions, :inverse_of => :ansible_playbook, :dependent => :destroy
    validates :name, :presence => true, :uniqueness => true
    scoped_search :on => :name
    default_scope -> { order("acd_ansible_playbooks.name") }

    def self.humanize_class_name(_name = nil)
      _('Ansible playbook')
    end

    def self.permission_name
      'ansible_playbooks'
    end

    def content
      case scm_type
      when 'directory'
        File.read(File.join(path, playfile))
      else
        raise NotImplementedError.new "scm_type #{scm_type.inspect} not supported!"
      end
    end

    def as_unified_structobj
      groups = []

      JSON.load(self.vars).each do |group_name, vars|
        groups << OpenStruct.new(
          :name => group_name,
          :vars => vars.map { |k,v| OpenStruct.new(:name => k, :value => v) })
      end

      adata = OpenStruct.new(
        :id => self.id,
        :name => self.name,
        :groups => JSON.load(self.vars)
      )
      adata
    end
  end
end
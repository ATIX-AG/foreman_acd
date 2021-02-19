# frozen_string_literal: true

module ForemanAcd
  # Ansible playbook
  class AnsiblePlaybook < ApplicationRecord
    include Authorizable
    include Taxonomix
    extend FriendlyId
    friendly_id :name
    include Parameterizable::ByIdName

    self.table_name = 'acd_ansible_playbooks'
    has_many :app_definitions, :inverse_of => :ansible_playbook, :foreign_key => 'acd_ansible_playbook_id', :dependent => :restrict_with_error
    validates :name, :presence => true, :uniqueness => true
    scoped_search :on => :name

    default_scope do
      with_taxonomy_scope do
        order('acd_ansible_playbooks.name')
      end
    end

    def used_location_ids
      Location.joins(:taxable_taxonomies).where(
        'taxable_taxonomies.taxable_type' => 'ForemanAcd::AnsiblePlaybook',
        'taxable_taxonomies.taxable_id' => id
      ).pluck("#{Taxonomy.table_name}.id")
    end

    def used_organization_ids
      Organization.joins(:taxable_taxonomies).where(
        'taxable_taxonomies.taxable_type' => 'ForemanAcd::AnsiblePlaybook',
        'taxable_taxonomies.taxable_id' => id
      ).pluck("#{Taxonomy.table_name}.id")
    end

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

      JSON.parse(vars).each do |group_name, vars|
        groups << OpenStruct.new(
          :name => group_name,
          :vars => vars.map { |k, v| OpenStruct.new(:name => k, :value => v) }
        )
      end

      adata = OpenStruct.new(
        :id => id,
        :name => name,
        :groups => JSON.parse(self.vars)
      )
      adata
    end
  end
end

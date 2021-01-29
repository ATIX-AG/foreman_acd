# frozen_string_literal: true

# Adding acd ansible playbooks db table
class AddAnsiblePlaybookId < ActiveRecord::Migration[5.2]
  def up
    add_column :app_definitions, :acd_ansible_playbook_id, :integer
    add_foreign_key 'app_definitions', 'acd_ansible_playbooks', :name => 'app_definitions_acd_ansible_playbooks_id_fk'
  end

  def down
    remove_foreign_key 'app_definitions', :name => 'app_definitions_acd_ansible_playbooks_id_fk'
    remove_column :app_definitions, :acd_ansible_playbook_id
  end
end

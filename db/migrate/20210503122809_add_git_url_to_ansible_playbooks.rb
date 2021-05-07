# frozen_string_literal: true

# Add git_url column to ansible_playbook
class AddGitUrlToAnsiblePlaybooks < ActiveRecord::Migration[6.0]
  def change
    add_column :acd_ansible_playbooks, :git_url, :string
  end
end

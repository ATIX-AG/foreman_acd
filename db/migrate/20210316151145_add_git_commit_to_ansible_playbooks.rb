# frozen_string_literal: true

# Add git_commit column to ansible_playbook
class AddGitCommitToAnsiblePlaybooks < ActiveRecord::Migration[6.0]
  def change
    add_column :acd_ansible_playbooks, :git_commit, :string
  end
end

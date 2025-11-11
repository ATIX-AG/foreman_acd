# frozen_string_literal: true

# Add ansible variables to app instances
class AddAnsibleVarsAllToAppInstances < ActiveRecord::Migration[5.2]
  def change
    add_column :app_instances, :ansible_vars_all, :text
  end
end

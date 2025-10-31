# frozen_string_literal: true

# Adding Rename ACD db tables
class RenameAcdTables < ActiveRecord::Migration[6.0]
  def up
    rename_table :app_definitions, :acd_app_definitions
    rename_table :app_instances, :acd_app_instances
    rename_table :foreman_hosts, :acd_foreman_hosts
  end

  def down
    rename_table :acd_app_definitions, :app_definitions
    rename_table :acd_app_instances, :app_instances
    rename_table :acd_foreman_hosts, :foreman_hosts
  end
end

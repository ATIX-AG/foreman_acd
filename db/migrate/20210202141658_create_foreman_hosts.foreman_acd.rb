# frozen_string_literal: true

# Adding acd_foreman_hosts db table
class CreateForemanHosts < ActiveRecord::Migration[6.0]
  def up
    create_table :foreman_hosts do |t|
      t.string :hostname, :default => '', :null => false, :limit => 255, :unique => true
      t.column :app_instance_id, :integer, :null => false
      t.column :host_id, :integer
      t.string :service
      t.string :description
      t.text :foremanParameters
      t.text :ansibleParameters

      t.timestamps :null => false
    end
    add_foreign_key :foreman_hosts, :app_instances
    add_foreign_key :foreman_hosts, :hosts
  end

  def down
    drop_table :foreman_hosts
  end
end

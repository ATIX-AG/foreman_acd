# frozen_string_literal: true

# Adding app_definitions db table
class CreateAppDefinitions < ActiveRecord::Migration[5.2]
  def up
    create_table :app_definitions do |t|
      t.string :name, :default => '', :null => false, :limit => 255, :unique => true
      t.text :description
      t.column :hostgroup_id, :integer
      t.text :parameters
      t.timestamps :null => true
    end
    add_foreign_key :app_definitions, :hostgroups
  end

  def down
    drop_table :app_definitions
  end
end

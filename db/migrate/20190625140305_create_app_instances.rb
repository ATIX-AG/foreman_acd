# frozen_string_literal: true

# Adding app_definitions db table
class CreateAppInstances < ActiveRecord::Migration[5.2]
  def up
    create_table :app_instances do |t|
      t.string :name, :default => '', :null => false, :limit => 255, :unique => true
      t.column :app_definition_id, :integer, :null => false
      t.text :description
      t.text :hosts
      t.timestamps :null => true
    end
    add_foreign_key :app_instances, :app_definitions
  end

  def down
    drop_table :app_instances
  end
end

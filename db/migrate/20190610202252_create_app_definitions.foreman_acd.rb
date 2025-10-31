# frozen_string_literal: true

# Adding app_definitions db table
class CreateAppDefinitions < ActiveRecord::Migration[5.2]
  def up
    create_table :app_definitions do |t|
      t.string :name, :default => '', :null => false, :limit => 255, :unique => true
      t.text :description
      t.text :services
      t.timestamps :null => true
    end
  end

  def down
    drop_table :app_definitions
  end
end

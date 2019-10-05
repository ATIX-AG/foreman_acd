# frozen_string_literal: true

# Add json parameters
class AddParameters < ActiveRecord::Migration[5.2]
  def up
    add_column :app_definitions, :parameters, :text
    add_column :app_instances, :parameters, :text
  end

  def down
    remove_column :app_definitions, :parameters
    remove_column :app_instances, :parameters
  end
end

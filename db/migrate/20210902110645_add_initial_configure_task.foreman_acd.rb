# frozen_string_literal: true

# Add AddInitialConfigureTask
class AddInitialConfigureTask < ActiveRecord::Migration[5.2]
  def change
    add_column :acd_app_instances, :initial_configure_task_id, :uuid, :null => true
  end
end

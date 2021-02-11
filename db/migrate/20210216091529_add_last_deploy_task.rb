# frozen_string_literal: true

# Add AddLastDeployTask
class AddLastDeployTask < ActiveRecord::Migration[5.2]
  def change
    add_column :acd_app_instances, :last_deploy_task_id, :uuid, :null => true
  end
end

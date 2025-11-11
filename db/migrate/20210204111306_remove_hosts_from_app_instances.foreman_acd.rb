# frozen_string_literal: true

# Remove hosts column from app_instances db table
class RemoveHostsFromAppInstances < ActiveRecord::Migration[6.0]
  def change
    remove_column :app_instances, :hosts, :text
  end
end

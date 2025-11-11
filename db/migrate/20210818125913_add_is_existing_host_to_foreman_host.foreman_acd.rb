# frozen_string_literal: true

# Add is_existing_host to app instance
class AddIsExistingHostToForemanHost < ActiveRecord::Migration[6.0]
  def change
    add_column :acd_foreman_hosts, :is_existing_host, :boolean, :default => false, :null => false
  end
end

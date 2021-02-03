# frozen_string_literal: true

# Add location to app instance
class AddLocationToAppInstance < ActiveRecord::Migration[6.0]
  def change
    add_column :app_instances, :location_id, :integer, :null => true, :index => true
  end
end

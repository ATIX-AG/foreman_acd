# frozen_string_literal: true

# Remove old permissons to run the remote execution jobs
class RemoveOldRexPermissions < ActiveRecord::Migration[6.0]
  def up
    Permission.where(:name => %w[new_remote_execution create_remote_execution]).destroy_all
  end

  def down
    # The permission will get recreated by seeds
  end
end

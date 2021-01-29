# frozen_string_literal: true

# Add organization to app instance
class AddOrganizationToAppInstance < ActiveRecord::Migration[6.0]
  # FakeAppInstance
  class AppInstance < ApplicationRecord
    belongs_to :organization
  end

  # FakeAppInstance
  class Organization < ApplicationRecord
  end

  def up
    Organization.table_name = 'taxonomies'
    add_column :app_instances, :organization_id, :integer, :null => true, :index => true
    AppInstance.all.each do |a|
      a.organization = Organization.first
      a.save!
    end
    change_column :app_instances, :organization_id, :integer, :null => false, :index => true
  end

  def down
    remove_column :app_instances, :organization_id, :integer
  end
end

class AddAnsibleGvAllToAppInstances < ActiveRecord::Migration[5.2]
  def change
    add_column :app_instances, :ansible_gv_all, :text
  end
end

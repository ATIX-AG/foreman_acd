class AddAnsibleGvAllToAppDefinitions < ActiveRecord::Migration[5.2]
  def change
    add_column :app_definitions, :ansible_gv_all, :text
  end
end

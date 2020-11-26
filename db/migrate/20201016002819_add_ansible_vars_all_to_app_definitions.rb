class AddAnsibleVarsAllToAppDefinitions < ActiveRecord::Migration[5.2]
  def change
    add_column :app_definitions, :ansible_vars_all, :text
  end
end

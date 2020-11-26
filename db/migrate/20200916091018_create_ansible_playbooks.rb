# frozen_string_literal: true

# Adding acd ansible playbooks db table
class CreateAnsiblePlaybooks < ActiveRecord::Migration[5.2]
  def up
    create_table :acd_ansible_playbooks do |t|
      t.string :name, :default => '', :null => false, :limit => 255, :unique => true
      t.text :description
      t.string :scm_type
      t.string :path
      t.string :playfile
      t.text :vars
      t.timestamps :null => true
    end
  end

  def down
    drop_table :acd_ansible_playbooks
  end
end

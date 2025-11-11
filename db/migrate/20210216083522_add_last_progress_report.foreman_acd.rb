# frozen_string_literal: true

# Add AddLastProgressReport
class AddLastProgressReport < ActiveRecord::Migration[5.2]
  def change
    add_column :acd_foreman_hosts, :last_progress_report, :text
  end
end

# frozen_string_literal: true

object @ansible_data
attribute :playbook_id
attribute :group_id

child :group_vars => :group_vars do
  node do |key,val|
    { 'name' => key, "value" => val }
  end
end

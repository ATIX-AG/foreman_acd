# frozen_string_literal: true

require 'foreman_acd/engine'

# Module required to start the Foreman Rails engine
module ForemanAcd
  def self.acd_base_path
    '/var/lib/foreman/foreman_acd/'
  end

  def self.ansible_playbook_path
    File.join(acd_base_path, 'ansible-playbooks')
  end
end

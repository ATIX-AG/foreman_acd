# frozen_string_literal: true

require 'test_plugin_helper'

module ForemanAcd
  # Ansible Playbook Model tests
  class AnsiblePlaybookTest < ActiveSupport::TestCase
    should validate_presence_of(:name)
    should validate_uniqueness_of(:name)
  end
end

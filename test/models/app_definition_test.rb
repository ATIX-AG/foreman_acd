# frozen_string_literal: true

require 'test_plugin_helper'

module ForemanAcd
  # Application Definition Model tests
  class AppDefinitionTest < ActiveSupport::TestCase
    should validate_presence_of(:name)
    should validate_uniqueness_of(:name)
    should belong_to(:hostgroup)
    should have_many(:app_instances).dependent(:destroy)
  end
end

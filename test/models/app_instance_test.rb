# frozen_string_literal: true

require 'test_plugin_helper'

module ForemanAcd
  # Application Instance Model tests
  class AppInstanceTest < ActiveSupport::TestCase
    should validate_presence_of(:name)
    should belong_to(:app_definition)
  end
end

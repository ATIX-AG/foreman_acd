require 'test_plugin_helper'

module ForemanAppcendep
  class AppInstanceTest < ActiveSupport::TestCase
    should validate_presence_of(:name)
    should belong_to(:app_definition)
  end
end

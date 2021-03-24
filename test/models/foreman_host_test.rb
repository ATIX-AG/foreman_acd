# frozen_string_literal: true

require 'test_plugin_helper'

module ForemanAcd
  # ForemanHost Model tests
  class ForemanHostTest < ActiveSupport::TestCase
    should validate_presence_of(:hostname)
    should belong_to(:app_instance)
    should belong_to(:host)
  end
end

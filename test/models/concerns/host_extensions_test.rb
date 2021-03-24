# frozen_string_literal: true

require 'test_plugin_helper'

module ForemanAcd
  # Host Extensions Test
  class HostExtensionsTest < ActiveSupport::TestCase
    setup do
      User.current = users :admin
    end

    test 'host was deployed via acd?' do
      host = FactoryBot.create :host
      app = FactoryBot.create :app_instance

      foreman_host = app.foreman_hosts.create(:hostname => host.name,
                                              :service => 'DB',
                                              :description => 'Description',
                                              :foremanParameters => nil,
                                              :ansibleParameters => nil)
      foreman_host.host = host
      foreman_host.save
      assert host.deployed_via_acd?
    end
  end
end

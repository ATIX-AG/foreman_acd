# frozen_string_literal: true

require 'test_plugin_helper'
require 'nokogiri'

module ForemanAcd
  # Application Instances Controller tests
  class AppInstancesControllerTest < ActionController::TestCase
    setup do
      as_admin { FactoryBot.create(:app_instance) }
      @model = ForemanAcd::AppInstance.first
    end

    def set_session_user
      org_a = Organization.find_by(:name => 'Organization 1')
      loc_a = Location.find_by(:name => 'Location 1')
      super.merge(:location_id => loc_a.id, :organization_id => org_a.id)
    end

    basic_index_test('app_instances')
    basic_new_test
    # basic_edit_test('app_instance')

    test 'should destroy app instance' do
      assert_difference('AppInstance.count', -1) do
        delete :destroy_with_hosts,
               :params => { :id => @model.id },
               :session => set_session_user
      end
    end
  end
end

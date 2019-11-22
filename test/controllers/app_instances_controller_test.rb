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

    basic_index_test('app_instances')
    basic_new_test
    basic_edit_test('app_instance')

    test 'should destroy app instance' do
      assert_difference('AppInstance.count', -1) do
        delete :destroy,
               :params => { :id => @model.id },
               :session => set_session_user
      end
      assert_redirected_to app_instances_url
    end
  end
end

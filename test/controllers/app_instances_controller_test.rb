require 'test_plugin_helper'
require 'nokogiri'

module ForemanAppcendep
  class AppInstancesControllerTest < ActionController::TestCase
    setup do
      @model = FactoryBot.create(:app_instance)
    end

    basic_index_test('app_instances')
    basic_new_test

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

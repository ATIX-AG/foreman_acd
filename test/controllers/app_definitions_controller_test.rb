require 'test_plugin_helper'
require 'nokogiri'

module ForemanAppcendep
  class AppDefinitionsControllerTest < ActionController::TestCase
    setup do
      @model = FactoryBot.create(:app_definition)
    end

    basic_index_test('app_definitions')
    basic_new_test

    test 'should destroy app definition' do
      assert_difference('AppDefinition.count', -1) do
      delete :destroy,
             :params => { :id => @model.id },
             :session => set_session_user
      end
      assert_redirected_to app_definitions_url
    end
  end
end

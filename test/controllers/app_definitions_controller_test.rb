# frozen_string_literal: true

require 'test_plugin_helper'
require 'nokogiri'

module ForemanAcd
  class AppDefinitionsControllerTest < ActionController::TestCase
    setup do
      as_admin { FactoryBot.create(:app_definition) }
      @model = ForemanAcd::AppDefinition.first
    end

    basic_index_test('app_definitions')
    basic_new_test
    basic_edit_test('app_definition')

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

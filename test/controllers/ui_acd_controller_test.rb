require 'test_plugin_helper'
require 'nokogiri'

class UiAcdControllerTest < ActionController::TestCase
  test 'get app json' do
    app_def = FactoryBot.create(:app_definition)
    get :app, params: { :id => app_def.id }, session: set_session_user
    assert_response :success

    assert_equal app_def.name, json_response['app_definition']['name']
    assert_equal app_def.hostgroup_id, json_response['fdata']['hostgroup_id']
    assert_equal app_def.hostgroup.domain.name, json_response['fdata']['domains'][0]['name']
    assert_equal app_def.hostgroup.environment.name, json_response['fdata']['environments'][0]['name']
    assert_equal app_def.hostgroup.ptable.name, json_response['fdata']['ptables'][0]['name']
  end

  test 'get fdata json' do
    hostgroup = FactoryBot.create(:hostgroup, :with_domain, :with_os, :with_environment)
    get :fdata, params: { :id => hostgroup.id }, session: set_session_user
    assert_response :success

    assert_equal hostgroup.environment.name, json_response['environments'][0]['name']
    assert_equal hostgroup.domain.name, json_response['domains'][0]['name']
    assert_equal hostgroup.ptable.name, json_response['ptables'][0]['name']
  end
end

# frozen_string_literal: true

require 'test_plugin_helper'
require 'nokogiri'

module Katello
  # Mock Katello::KTEnvironment so that tests run without Katello
  class KTEnvironment
    def self.all
      [{ :id => 1, :name => 'Library' }, { :id => 2, :name => 'Test' }]
    end
  end
end

# UI Controller tests
class UIAcdControllerTest < ActionController::TestCase
  test 'get app json' do
    app_def = FactoryBot.create(:app_definition)
    get :app, :params => { :id => app_def.id }, :session => set_session_user
    assert_response :success

    json_app_services = JSON.parse(app_def.services)
    json_app_all = JSON.parse(app_def.ansible_vars_all)
    parsed_services_response = JSON.parse(json_response['app_definition']['services'])
    parsed_all_response = JSON.parse(json_response['app_definition']['ansible_vars_all'])

    assert_equal app_def.name, json_response['app_definition']['name']
    assert_equal json_app_services.first['name'], parsed_services_response.first['name']
    assert_equal json_app_services.first['ansibleGroup'], parsed_services_response.first['ansibleGroup']
    assert_equal json_app_all.first['name'], parsed_all_response.first['name']
  end

  test 'get foreman data json foreman <3' do
    # TODO: Get rid of the puppet dependency at all!
    skip 'Puppet env was removed with foreman >= 3.x' unless defined?(ForemanPuppet)

    hostgroup = FactoryBot.create(:hostgroup, :with_domain, :with_os, :with_environment)
    get :foreman_data, :params => { :id => hostgroup.id }, :session => set_session_user
    assert_response :success

    assert_equal hostgroup.id, json_response['hostgroup_id']
    assert_equal hostgroup.environment.name, json_response['environments'][0]['name']
    assert_equal hostgroup.domain.name, json_response['domains'][0]['name']
    assert_equal hostgroup.ptable.name, json_response['ptables'][0]['name']
  end

  test 'get ansible data json' do
    ansible_playbook = FactoryBot.create(:ansible_playbook)
    get :ansible_data, :params => { :id => ansible_playbook.id }, :session => set_session_user
    assert_response :success

    json_playbook = JSON.parse(ansible_playbook.vars)
    assert_equal ansible_playbook.name, json_response['name']
    assert_equal json_playbook['dbservers']['mysqlservice'], json_response['groups']['dbservers']['mysqlservice']
    assert_equal json_playbook['all']['repository'], json_response['groups']['all']['repository']
  end
end

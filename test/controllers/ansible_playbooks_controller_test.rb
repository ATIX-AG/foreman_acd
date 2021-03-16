# frozen_string_literal: true

require 'test_plugin_helper'
require 'nokogiri'

module ForemanAcd
  # Ansible Playbooks Controller tests
  class AnsiblePlaybooksControllerTest < ActionController::TestCase
    setup do
      as_admin { FactoryBot.create(:ansible_playbook) }
      @model = ForemanAcd::AnsiblePlaybook.first
    end

    basic_index_test('ansible_playbooks')
    basic_new_test
    basic_edit_test('ansible_playbook')

    test 'should destroy ansible playbook' do
      assert_difference('AnsiblePlaybook.count', -1) do
        delete :destroy,
               :params => { :id => @model.id },
               :session => set_session_user
      end
      assert_redirected_to ansible_playbooks_url
    end
  end
end

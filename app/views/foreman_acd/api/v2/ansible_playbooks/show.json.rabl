# frozen_string_literal: true

object @ansible_playbook

extends 'foreman_acd/api/v2/ansible_playbooks/base'

node do |ansible_playbook|
  partial('api/v2/taxonomies/children_nodes', :object => ansible_playbook)
end

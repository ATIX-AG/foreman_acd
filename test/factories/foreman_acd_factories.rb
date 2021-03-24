# frozen_string_literal: true

FactoryBot.define do
  factory :ansible_playbook, :class => 'ForemanAcd::AnsiblePlaybook' do
    sequence(:name) { |n| "ansible_playbook#{n}" }
    sequence(:description) { |n| "description#{n}" }
    scm_type { 'directory' }
    path { '/home/vagrant/acd_examples/ansible-playbook' }
    playfile { 'site.yml' }
    vars { '{"dbservers":{"mysqlservice":"mysqld","mysql_port":3306,"dbuser":"webapp","dbname":"ANSAP01","upassword":"Bond@007","masterpassword":"MySQL@007"},"all":{"repository":"https://github.com/bennojoy/mywebapp.git"},"webservers":{"dummy_var":0}}' }
  end

  factory :app_definition, :class => 'ForemanAcd::AppDefinition' do
    sequence(:name) { |n| "app_definition#{n}" }
    sequence(:description) { |n| "description#{n}" }
    ansible_playbook
    services do
      '[{"id":1,"name":"DB","description":"","hostgroup":"1","ansibleGroup":"dbservers","minCount":"","maxCount":"","foremanParameters":[],"ansibleParameters":[{"id":0,"name":"mysqlservice","value":"mysqld"},{"id":1,"name":"mysql_port","value":"3306"},{"id":2,"name":"dbuser","value":"webapp"},{"id":3,"name":"dbname","value":"ANSAP01"},{"id":4,"name":"upassword","value":"Bond@007"},{"id":5,"name":"masterpassword","value":"MySQL@007"}]},{"id":2,"name":"Web","description":"","hostgroup":"1","ansibleGroup":"webservers","minCount":"","maxCount":"","foremanParameters":[],"ansibleParameters":[{"id":0,"name":"dummy_var","value":"0"}]}]'
    end
    ansible_vars_all { '[{"id":0,"name":"repository","value":"https://github.com/bennojoy/mywebapp.git"}]' }
  end

  factory :app_instance, :class => 'ForemanAcd::AppInstance' do
    sequence(:name) { |n| "app_instance#{n}" }
    sequence(:description) { |n| "description#{n}" }
    app_definition
    location { Location.find_by(:name => 'Location 1') }
    organization { Organization.find_by(:name => 'Organization 1') }
    ansible_vars_all { '[{"id":0,"name":"repository","value":"https://github.com/bennojoy/mywebapp.git"}]' }
  end
end

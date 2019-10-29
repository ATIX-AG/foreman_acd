# frozen_string_literal: true

FactoryBot.define do
  factory :app_definition, :class => 'ForemanAppcendep::AppDefinition' do
    sequence(:name) { |n| "app_definition#{n}" }
    sequence(:description) {|n| "description#{n}" }
    hostgroup { FactoryBot.create(:hostgroup, :with_domain, :with_os, :with_environment ) }
    parameters { "[{\"id\":0,\"name\":\"Hostname\",\"description\":\"\",\"type\":\"hostname\",\"value\":\"mysqllinux\"},{\"id\":1,\"name\":\"RootPW\",\"description\":\"\",\"type\":\"password\",\"value\":\"sesam12345\"},{\"id\":2,\"name\":\"ansible_root\",\"description\":\"\",\"type\":\"hostparam\",\"value\":\"/root/ansible\"}]" }
  end

  factory :app_instance, :class => 'ForemanAppcendep::AppInstance' do
    sequence(:name) { |n| "app_instance#{n}" }
    app_definition { FactoryBot.create(:app_definition) }
    sequence(:description) {|n| "description#{n}" }
    parameters { "[{\"id\":0,\"name\":\"Hostname\",\"description\":\"\",\"type\":\"hostname\",\"value\":\"mysqllinux\"},{\"id\":1,\"name\":\"RootPW\",\"description\":\"\",\"type\":\"password\",\"value\":\"sesam12345\"},{\"id\":2,\"name\":\"ansible_root\",\"description\":\"\",\"type\":\"hostparam\",\"value\":\"/root/ansible\"}]" }
  end
end

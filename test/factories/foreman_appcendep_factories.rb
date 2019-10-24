# frozen_string_literal: true

FactoryBot.define do
  factory :app_definition, :class => 'ForemanAppcendep::AppDefinition' do
    sequence(:name) { |n| "app_definition#{n}" }
  end

  factory :app_instance, :class => 'ForemanAppcendep::AppInstance' do
    sequence(:name) { |n| "app_instance#{n}" }
    app_definition { FactoryBot.create(:app_definition) }
  end
end

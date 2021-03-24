# frozen_string_literal: true

require 'test_plugin_helper'

module ForemanAcd
  # ACD Provider Test
  class AcdProviderTest < ActiveSupport::TestCase
    describe '.provider_names' do
      let(:provider_names) { AcdProvider.provider_names }

      it 'returns only strings' do
        provider_names.each do |name|
          _(name).must_be_kind_of String
        end
      end

      context 'provider is registetered under :custom symbol' do
        before { AcdProvider.register(:ACD, String) }
        it { _(provider_names).must_include 'ACD' }
      end
    end

    describe AcdProvider do
      before { User.current = FactoryBot.build(:user, :admin) }
      after { User.current = nil }

      before do
        Setting::RemoteExecution.load_defaults
      end

      let(:job_invocation) { FactoryBot.create(:job_invocation, :with_template) }
      let(:template_invocation) { job_invocation.pattern_template_invocations.first }
      let(:host) { FactoryBot.create(:host) }
      let(:proxy_options) { AcdProvider.proxy_command_options(template_invocation, host) }
    end
  end
end

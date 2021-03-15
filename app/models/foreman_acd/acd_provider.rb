# frozen_string_literal: true

module ForemanAcd
  # Implement a RemoteExecutionProvider
  class AcdProvider < ::RemoteExecutionProvider
    class << self
      def supports_effective_user?
        true
      end

      def proxy_operation_name
        'acd'
      end

      def humanized_name
        'ACD'
      end

      def proxy_command_options(template_invocation, host)
        super(template_invocation, host).merge(:name => host.name)
      end

      def ssh_password(_host); end

      def ssh_key_passphrase(_host); end

      def sudo_password(_host); end

      def required_proxy_selector_for(_template)
        AcdProxyProxySelector.new
      end
    end
  end
end

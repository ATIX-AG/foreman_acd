# frozen_string_literal: true

module ForemanAcd
  # AcdProxy Selector implementing a RemoteExecutionProxySelector which
  # only returns the Smart Proxy of the given host
  class AcdProxyProxySelector < ::RemoteExecutionProxySelector
    def determine_proxy(*args)
      host, _provider = args

      # We already did the determine_proxy in app_configurator. We want that REX
      # isn't doing the determination of the proxy twice.
      # Therefore, we will just return the host, which is the proxy!

      ::SmartProxy.find_by(:name => host.name)
    end
  end
end

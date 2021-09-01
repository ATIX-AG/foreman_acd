module ForemanAcd
  module Concerns
    # Shared code for AppInstance API and UI controller
    module AppInstanceMixins
      extend ActiveSupport::Concern

      def collect_host_report_data(app_instance)
        report_data = []

        app_instance.foreman_hosts.each do |foreman_host|
          a_host = {
            :id => nil,
            :name => foreman_host.hostname,
            :build => nil,
            :hostUrl => nil,
            :progress_report => foreman_host.last_progress_report.empty? ? [] : JSON.parse(foreman_host.last_progress_report)
          }

          if foreman_host.host.present?
            a_host.update({
              :id => foreman_host.host.id,
              :build => foreman_host.host.build,
              :hostUrl => host_path(foreman_host.host),
              :isExistingHost => foreman_host.is_existing_host,
              :powerStatusUrl => power_api_host_path(foreman_host.host)
            })
          end
          report_data << OpenStruct.new(a_host)
        end
        report_data
      end
    end
  end
end

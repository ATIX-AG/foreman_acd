# frozen_string_literal: true

module Actions
  module ForemanAcd
    # DeployAllHosts implements a Foreman Task EntryAction
    class DeployAllHosts < Actions::EntryAction
      def plan(app_instance)
        action_subject(app_instance)
        plan_self(:id => app_instance.id)
      end

      def run
        output[:status] = 'SUCCESS'
        app_instance = ::ForemanAcd::AppInstance.find(input.fetch(:id))

        # Goal: all or nothing
        begin
          ::Foreman::Logging.logger('foreman_acd').info "Start to deploy all hosts of the app #{app_instance}"
          app_instance.foreman_hosts.each do |foreman_host|
            foreman_host.host.setBuild
          end
        rescue StandardError => e
          ::Foreman::Logging.logger('foreman_acd').error "Error while deploying hosts for application instance: #{e}"
          remember_host_ids = app_instance.foreman_hosts.map(&:host_id)

          # Clean the app instance association first
          app_instance.foreman_hosts.update_all(host_id: nil)

          # Remove all hosts afterwards
          remember_host_ids.each do |host_id|
            ::Host.find(host_id).destroy
          end
          output[:error] = e.to_s
          output[:status] = 'FAILURE'
        end
      end

      def finalize; end

      def rescue_strategy
        Dynflow::Action::Rescue::Fail
      end

      def humanized_name
        _('Deploy application instance hosts')
      end
    end
  end
end

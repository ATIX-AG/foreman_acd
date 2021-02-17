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
        output[:status] = 'IN PROGRESS'
        app_instance = ::ForemanAcd::AppInstance.find(input.fetch(:id))

        # Goal: all or nothing
        begin
          ::Foreman::Logging.logger('foreman_acd').info "Start to deploy all hosts of the app #{app_instance}"
          app_deployer = ::ForemanAcd::AppDeployer.new(app_instance)
          output[:data] = app_deployer.deploy
          output[:status] = 'SUCCESS'
        rescue StandardError => e
          ::Foreman::Logging.logger('foreman_acd').error "Error while deploying hosts for application instance. Clean up all other hosts: #{e}"
          app_instance.clean_all_hosts

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

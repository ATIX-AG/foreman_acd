# frozen_string_literal: true

module Actions
  module ForemanAcd
    # DeployAllHosts implements a Foreman Task EntryAction
    class DeployAllHosts < Actions::EntryAction
      def plan(app_instance, safe_deploy)
        plan_self(:id => app_instance.id, :safe_deploy => safe_deploy)
      end

      def run
        output[:status] = 'IN PROGRESS'
        app_instance = ::ForemanAcd::AppInstance.find(input.fetch(:id))
        safe_deploy = input.fetch(:safe_deploy)

        # Goal: all, safe_deploy or nothing
        begin
          if safe_deploy
            ::Foreman::Logging.logger('foreman_acd').info "Start to safe deploy hosts of the app #{app_instance}"
          else
            ::Foreman::Logging.logger('foreman_acd').info "Start to deploy all hosts of the app #{app_instance}"
          end
          app_deployer = ::ForemanAcd::AppDeployer.new(app_instance)
          output[:data] = app_deployer.deploy(safe_deploy)
          output[:status] = 'SUCCESS'
        rescue StandardError => e
          ::Foreman::Logging.logger('foreman_acd').error "Error while deploying hosts for application instance '#{app_instance.name}'. Clean up all other hosts: #{e}"
          app_instance.clean_all_hosts

          output[:status] = 'FAILURE'
          raise "Error while deploying hosts for application instance '#{app_instance.name}': (#{e.message})"
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

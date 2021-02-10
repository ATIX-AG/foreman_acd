# frozen_string_literal: true

module Actions
  module ForemanAcd
    # RunConfigurator implements a Foreman Task EntryAction
    class RunConfigurator < Actions::EntryAction
      def plan(app_instance)
        action_subject(app_instance)
        plan_self(:id => app_instance.id)
      end

      def run
        output[:status] = 'SUCCESS'
        begin
          app_instance = ::ForemanAcd::AppInstance.find(input.fetch(:id))
          app_configurator = ::ForemanAcd::AppConfigurator.new(app_instance)

          jobs = app_configurator.configure
          ::Foreman::Logging.logger('foreman_acd').info "Creating #{jobs.count} job(s) to configure the app #{app_instance}"

          # TODO: would it be better to create a sub task for each job we need to run?
          jobs.each(&:trigger)
        rescue StandardError => e
          ::Foreman::Logging.logger('foreman_acd').error "Error while configuring application instance: #{e}"
          output[:error] = e.to_s
          output[:status] = 'FAILURE'
        end
      end

      def finalize; end

      def rescue_strategy
        Dynflow::Action::Rescue::Fail
      end

      def humanized_name
        _('Configure application instance after hosts deployment')
      end
    end
  end
end
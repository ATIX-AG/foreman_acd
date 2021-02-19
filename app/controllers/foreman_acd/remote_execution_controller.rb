# frozen_string_literal: true

module ForemanAcd
  # Class to run remote execution jobs
  class RemoteExecutionController < JobInvocationsController
    def new
      jobs = init_configuration
      @composer = jobs.first
    end

    def create
      customize_first = params[:customize] || false
      jobs = init_configuration

      if jobs.count == 1 && customize_first == false
        @composer = jobs.first
        @composer.trigger!
        redirect_to job_invocation_path(@composer.job_invocation)
      elsif customize_first == false
        jobs.each(&:trigger)
        redirect_to job_invocations_path
      else
        # redirect to the job itself if we want to customize the job
        @composer = jobs.first
        render :action => 'new'
      end
    end

    # to overcome the isolated namespace engine difficulties with paths
    helper Rails.application.routes.url_helpers
    def _routes
      Rails.application.routes
    end

    private

    def init_configuration
      app_instance = ForemanAcd::AppInstance.find_by(:id => params[:id])
      app_configurator = ForemanAcd::AppConfigurator.new(app_instance)

      jobs = app_configurator.configure
      logger.debug("Creating #{jobs.count} job(s) to configure the app #{app_instance}. Customize first: #{params[:customize]}")
      jobs
    end
  end
end

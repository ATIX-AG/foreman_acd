# frozen_string_literal: true

module ForemanAcd
  # Class to run remote execution jobs
  class RemoteExecutionController < JobInvocationsController
    def new
      @composer = init_configuration
    end

    def create
      customize_first = params[:customize] || false
      begin
        job = init_configuration
        @composer = job
        if customize_first == false
          @composer.trigger!
          redirect_to job_invocation_path(@composer.job_invocation)
        else
          # redirect to the job itself if we want to customize the job
          render :action => 'new'
        end
      rescue StandardError => e
        redirect_to app_instances_path, :error => _("#{job}, #{e}")
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
      result, job = app_configurator.configure
      if result.success
        logger.debug("Creating job to configure the app #{app_instance}. Customize first: #{params[:customize]}")
        job
      else
        result.error
      end
    end
  end
end

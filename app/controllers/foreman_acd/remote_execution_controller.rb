# frozen_string_literal: true

module ForemanAcd
  # Class to run remote execution jobs
  class RemoteExecutionController < JobInvocationsController
    def new
      set_app_instance
      result, job = init_configuration

      if result.success == true
        @composer = job
      else
        redirect_to(app_instances_path, :error => _("Coult not create remote execution job to configure the app '%{app_instance}': %{msg}") % {
          :app_instance => @app_instance, :msg => result.error
        })
      end
    end

    def create
      customize_first = params[:customize] || false
      begin
        set_app_instance
        result, job = init_configuration

        unless result.success == true
          return redirect_to(app_instances_path, :error => _("Coult not create remote execution job to configure the app '%{app_instance}': %{msg}") % {
            :app_instance => @app_instance, :msg => result.error
          })
        end

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

    def set_app_instance
      @app_instance = ForemanAcd::AppInstance.find_by(:id => params[:id])
    end

    def init_configuration
      logger.debug("Creating job to configure the app #{@app_instance}. Customize first: #{params[:customize]}")
      app_configurator = ForemanAcd::AppConfigurator.new(@app_instance)
      app_configurator.configure
    end
  end
end

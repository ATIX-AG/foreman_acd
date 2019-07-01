# frozen_string_literal: true

module ForemanAppcendep
  # Application Instance Controller
  class AppInstancesController < ::ForemanAppcendep::ApplicationController
    include Foreman::Controller::AutoCompleteSearch
    include ::ForemanAppcendep::Concerns::AppInstanceParameters

    before_action :find_resource, :only => [:edit, :update, :destroy, :deploy]

    def index
      @app_instances = resource_base.search_for(params[:search], :order => params[:order]).paginate(:page => params[:page])
    end

    def new
      @app_instance = AppInstance.new
    end

    def create
      @app_instance = AppInstance.new(app_instance_params)
      if @app_instance.save
        process_success
      else
        process_error
      end
    end

    def edit; end

    def update
      if @app_instance.update(app_instance_params)
        process_success
      else
        process_error
      end
    end

    def destroy
      if @app_instance.destroy
        process_success
      else
        process_error
      end
    end

    def action_permission
      case params[:action]
      when 'deploy'
        :deploy
      else
        super
      end
    end

    def deploy
      redirect_to app_instances_path
    end
  end
end

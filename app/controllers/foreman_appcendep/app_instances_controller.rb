# frozen_string_literal: true

module ForemanAppcendep
  # Application Instance Controller
  class AppInstancesController < ::ForemanAppcendep::ApplicationController
    include Foreman::Controller::AutoCompleteSearch
    # include ::ForemanSalt::Concerns::AppInstanceParameters

    before_action :find_resource, :only => [:edit, :update, :destroy]

    def index; end

    def new; end

    def create; end

    def edit; end

    def update; end

    def destroy; end
  end
end

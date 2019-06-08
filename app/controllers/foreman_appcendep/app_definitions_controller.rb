# frozen_string_literal: true

module ForemanAppcendep
  # Application Definition Controller
  class AppDefinitionsController < ::ForemanAppcendep::ApplicationController
    include Foreman::Controller::AutoCompleteSearch
    # include ::ForemanSalt::Concerns::AppDefinitionParameters

    before_action :find_resource, :only => [:edit, :update, :destroy]

    def index; end

    def new; end

    def create; end

    def edit; end

    def update; end

    def destroy; end
  end
end

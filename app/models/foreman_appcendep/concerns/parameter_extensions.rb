# frozen_string_literal: true

module ForemanAppcendep
  module Concerns
    # extend foreman's Parameter class with our own Parameter type
    module ParameterExtensions
      extend ActiveSupport::Concern

      included do
        belongs_to :application, :foreign_key => :reference_id, :inverse_of => :application_parameters, :class_name => '::ForemanAppcendep::AppDefinition'
        scoped_search :relation => :application, :on => :name, :complete_value => true, :rename => 'application_name'

        ::Parameter::PRIORITY[:application_parameters] = 5
      end
    end
  end
end

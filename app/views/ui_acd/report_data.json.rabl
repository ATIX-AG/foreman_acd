# frozen_string_literal: true

object @report_data
attribute :deploymentState
attribute :initialConfigureState
attribute :initialConfigureJobUrl

child :hosts => :hosts do
  extends 'ui_acd/host_report'
end

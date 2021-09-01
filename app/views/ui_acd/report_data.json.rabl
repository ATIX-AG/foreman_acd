# frozen_string_literal: true

object @report_data
attribute :deployment_state

child :hosts => :hosts do
  extends 'ui_acd/host_report'
end

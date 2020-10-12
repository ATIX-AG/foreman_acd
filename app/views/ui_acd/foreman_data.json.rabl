# frozen_string_literal: true

object @foreman_data
attribute :hostgroup_id

child :environments => :environments do
  extends 'ui_acd/environment'
end

child :lifecycle_environments => :lifecycle_environments do
  extends 'ui_acd/lifecycle_environment'
end

child :domains => :domains do
  extends 'ui_acd/domain'
end

child :computeprofiles => :computeprofiles do
  extends 'ui_acd/computeprofile'
end

child :ptables => :ptables do
  extends 'ui_acd/ptable'
end

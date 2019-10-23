# frozen_string_literal: true

object @fdata
attribute :hostgroup_id

child :environments => :environments do
  extends 'ui_appcendep/environment'
end

child :lifecycle_environments => :lifecycle_environments do
  extends 'ui_appcendep/lifecycle_environment'
end

child :domains => :domains do
  extends 'ui_appcendep/domain'
end

child :computeprofiles => :computeprofiles do
  extends 'ui_appcendep/computeprofile'
end

child :ptables => :ptables do
  extends 'ui_appcendep/ptable'
end

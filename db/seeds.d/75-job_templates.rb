# frozen_string_literal: true

User.as_anonymous_admin do
  JobTemplate.without_auditing do
    Dir[File.join("#{ForemanAcd::Engine.root}/app/views/templates/**/*.erb")].each do |template|
      sync = !Rails.env.test? && Setting[:remote_execution_sync_templates]
      template = JobTemplate.import_raw!(File.read(template), :default => true, :lock => true, :update => sync)

      template.organizations << Organization.unscoped.all if template&.organizations&.empty?
      template.locations << Location.unscoped.all if template&.locations&.empty?
    end
  end
end

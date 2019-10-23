# frozen_string_literal: true

require 'rake/testtask'

# Tasks
namespace :foreman_appcendep do
  namespace :example do
    desc 'Example Task'
    task :task => :environment do
      # Task goes here
    end
  end
end

# Tests
namespace :test do
  desc 'Test ForemanAppcendep'
  Rake::TestTask.new(:foreman_appcendep) do |t|
    test_dir = File.join(File.dirname(__FILE__), '../..', 'test')
    t.libs << ['test', test_dir]
    t.pattern = "#{test_dir}/**/*_test.rb"
    t.verbose = true
    t.warning = false
  end
end

namespace :foreman_appcendep do
  task :rubocop do
    begin
      require 'rubocop/rake_task'
      RuboCop::RakeTask.new(:rubocop_foreman_appcendep) do |task|
        task.patterns = ["#{ForemanAppcendep::Engine.root}/app/**/*.rb",
                         "#{ForemanAppcendep::Engine.root}/lib/**/*.rb",
                         "#{ForemanAppcendep::Engine.root}/test/**/*.rb"]
      end
    rescue StandardError
      puts 'Rubocop not loaded.'
    end

    Rake::Task['rubocop_foreman_appcendep'].invoke
  end
end

Rake::Task[:test].enhance ['test:foreman_appcendep']

load 'tasks/jenkins.rake'
Rake::Task['jenkins:unit'].enhance ['test:foreman_appcendep', 'foreman_appcendep:rubocop'] if Rake::Task.task_defined?(:'jenkins:unit')

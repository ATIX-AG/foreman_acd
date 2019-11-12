# frozen_string_literal: true

require 'rake/testtask'

# Tasks
namespace :foreman_acd do
  namespace :example do
    desc 'Example Task'
    task :task => :environment do
      # Task goes here
    end
  end
end

# Tests
namespace :test do
  desc 'Test ForemanAcd'
  Rake::TestTask.new(:foreman_acd) do |t|
    test_dir = File.join(File.dirname(__FILE__), '../..', 'test')
    t.libs << ['test', test_dir]
    t.pattern = "#{test_dir}/**/*_test.rb"
    t.verbose = true
    t.warning = false
  end
end

namespace :foreman_acd do
  task :rubocop do
    begin
      require 'rubocop/rake_task'
      RuboCop::RakeTask.new(:rubocop_foreman_acd) do |task|
        task.patterns = ["#{ForemanAcd::Engine.root}/app/**/*.rb",
                         "#{ForemanAcd::Engine.root}/lib/**/*.rb",
                         "#{ForemanAcd::Engine.root}/test/**/*.rb"]
      end
    rescue StandardError
      puts 'Rubocop not loaded.'
    end

    Rake::Task['rubocop_foreman_acd'].invoke
  end
end

Rake::Task[:test].enhance ['test:foreman_acd']

load 'tasks/jenkins.rake'
Rake::Task['jenkins:unit'].enhance ['test:foreman_acd', 'foreman_acd:rubocop'] if Rake::Task.task_defined?(:'jenkins:unit')

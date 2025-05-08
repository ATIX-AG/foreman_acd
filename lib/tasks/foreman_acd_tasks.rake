# frozen_string_literal: true

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
  require 'rubocop/rake_task'
  RuboCop::RakeTask.new(:rubocop) do |task|
    task.options = ['--force-exclusion']
    task.patterns = [ForemanAcd::Engine.root.to_s]
  end
rescue LoadError
  puts 'Rubocop not loaded.'
end

Rake::Task[:test].enhance ['test:foreman_acd']

load 'tasks/jenkins.rake'
Rake::Task['jenkins:unit'].enhance ['test:foreman_acd', 'foreman_acd:rubocop'] if Rake::Task.task_defined?(:'jenkins:unit')

# frozen_string_literal: true

require File.expand_path('lib/foreman_acd/version', __dir__)
require 'date'

Gem::Specification.new do |s|
  s.name        = 'foreman_acd'
  s.version     = ForemanAcd::VERSION
  s.license     = 'GPL-3.0'
  s.authors     = ['ATIX AG']
  s.email       = ['info@atix.de']
  s.homepage    = 'https://www.orcharhino.com'
  s.summary     = 'Foreman plugin to provide application centric deployment and self service portal'
  # also update locale/gemspec.rb
  s.description = 'Foreman plugin to provide application centric deployment and self service portal'
  s.required_ruby_version = '>= 2.7', '< 4'

  s.files = Dir['{app,config,db,lib,locale,webpack}/**/*'] + ['LICENSE', 'Rakefile', 'README.md', 'package.json']
  s.test_files = Dir['test/**/*']

  s.add_development_dependency 'rubocop', '~> 0.89.0'
  s.add_development_dependency 'rubocop-rails', '~> 2.8.1'
  s.add_dependency 'foreman_remote_execution', '>= 8.0'
  s.add_dependency 'foreman-tasks', '>= 7.0'
  s.add_dependency 'git'
end

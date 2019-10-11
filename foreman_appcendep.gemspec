# frozen_string_literal: true

require File.expand_path('lib/foreman_appcendep/version', __dir__)

Gem::Specification.new do |s|
  s.name        = 'foreman_appcendep'
  s.version     = ForemanAppcendep::VERSION
  s.license     = 'GPL-3.0'
  s.authors     = ['ATIX AG']
  s.email       = ['info@atix.de']
  s.homepage    = 'https://www.orcharhino.com'
  s.summary     = 'Application Centric Deployment for Foreman'
  # also update locale/gemspec.rb
  s.description = 'Application Centric Deployment.'

  s.files = Dir['{app,config,db,lib,locale,webpack}/**/*'] + ['LICENSE', 'Rakefile', 'README.md', 'package.json']
  s.test_files = Dir['test/**/*']

  s.add_development_dependency 'rubocop', '~> 0.52'

  s.add_dependency 'foreman-tasks', '~> 0.10'
  s.add_dependency 'rails', '~> 5.1'
end

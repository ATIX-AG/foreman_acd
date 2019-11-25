# frozen_string_literal: true

require File.expand_path('lib/foreman_acd/version', __dir__)

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

  s.files = Dir['{app,config,db,lib,locale,webpack}/**/*'] + ['LICENSE', 'Rakefile', 'README.md', 'package.json']
  s.test_files = Dir['test/**/*']

  s.add_development_dependency 'rubocop', '~> 0.71.0'
  s.add_development_dependency 'rubocop-checkstyle_formatter', '~> 0.2'
  s.add_development_dependency 'rubocop-performance', '~> 1.4.0'
  s.add_development_dependency 'rubocop-rails', '~> 2.0.1'
end
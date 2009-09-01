root_dir = File.dirname(__FILE__)

# the middlewares
require 'rack'
require 'lib/rack/trailingslash'

# the app
require 'sinatra'
require 'lachstock'

set :options, {
  :views => File.join(root_dir, 'views'),
  :app_file => File.join(root_dir, 'lachstock.rb'),
  :run => false, 
  :env => ENV['RACK_ENV'] ? ENV["RACK_ENV"].to_sym : "development",
  :raise_errors => true
  }
  
  log = File.new("sinatra.log", "a")
  STDOUT.reopen(log)
  STDERR.reopen(log)

use TrailingSlash
# use Rack::Lint # for Rack dev
# run Sinatra::Application
run Lachstock::App.new

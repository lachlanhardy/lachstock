root_dir = File.dirname(__FILE__)

# the middlewares
require 'rack'
# require './lib/rack/trailingslash'

# the app
require 'sinatra'
require './lachstock'

# set :views => File.join(root_dir, 'views')

set :haml, {:format => :html5, :escape_html => false}
set :app_file => File.join(root_dir, 'lachstock.rb')
set :run => false
set :environment => ENV['RACK_ENV'] ? ENV["RACK_ENV"].to_sym : "development"
# set :environment => 'production' # for testing minification etc
set :raise_errors => true

if ENV['RACK_ENV'] != 'production'
  log = File.new("log/sinatra.log", "a")
  STDOUT.reopen(log)
  STDERR.reopen(log)
end

# use TrailingSlash
run Lachstock::App.new

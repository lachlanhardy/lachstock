# the middlewares
require 'rack'
# require './lib/rack/trailingslash'

# the app
require 'sinatra'
require './lachstock'

if ENV['RACK_ENV'] != 'production'
  log = File.new("log/sinatra.log", "a")
  STDOUT.reopen(log)
  STDERR.reopen(log)
end

run Lachstock::App.new

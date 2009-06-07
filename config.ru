
# the middlewares
require 'rack'
require 'lib/rack/trailingslash'

# the app
require 'sinatra'
require 'lachstock'
 
Sinatra::Application.default_options.merge!(
  :run => false,
  # :env => :production
  :env => :development
)     


use TrailingSlash
# use Rack::Lint # for Rack dev
run Sinatra::Application

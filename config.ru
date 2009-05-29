
# the middlewares
require 'rack'
require 'lib/rack/trailingslash' 

# the app
require 'sinatra'
require 'lachstock'
 
Sinatra::Application.default_options.merge!(
  :run => false,
  :env => :production
)     


use TrailingSlash
# use Rack::Lint
run Sinatra::Application

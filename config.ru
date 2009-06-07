
# the middlewares
require 'rack'
require 'lib/rack/trailingslash' 

# the app
require 'sinatra'
require 'lachstock'

set :options, {:run => false, :env => :development}

use TrailingSlash
# use Rack::Lint
run Sinatra::Application

require 'rubygems'
require 'sinatra/base'
require 'haml'
# require 'twitter'
require 'yaml'
require 'net/http'
require 'pp' # only for dev work

module Lachstock
  load "#{File.dirname(__FILE__)}/lib/metadata.rb"
  load "#{File.dirname(__FILE__)}/lib/avatars.rb"

# set :haml, {:format => :html5, :attr_wrapper => '"'}
# set :environment => 'production' # for testing minification etc
  
  class App < Sinatra::Application
    Dir.glob("lib/helpers/*").each do |helper|
      require "#{File.dirname(__FILE__)}/#{helper}"
    end

    helpers do
      include Lachstock::Helpers
    end

    configure do
      #configure_avatars(Dir.glob("public/images/userlist.yaml")[0])
    end

    error do
      handle_fail
    end

    not_found do
      handle_fail
    end

    # homepage
    get '/' do
      @category = "home"
      haml :index
    end

    get '/:category/feed/' do 
      @category = params[:category]
      @items = Metadata.type(@category.to_sym).all.sort_by {|item| item.published}.reverse
      content_type 'application/atom+xml', :charset => 'utf-8'
      haml :feeds, {:format => :xhtml, :layout => false}
    end

    # This is now obsolete, replace with mod_rewrite rule
    get '/feeds/:category' do 
      @category = params[:category]
      @items = Metadata.type(@category.to_sym).all.sort_by {|item| item.published}.reverse
      content_type 'application/atom+xml', :charset => 'utf-8'
      haml :feeds, {:format => :xhtml, :layout => false}
    end

    get '/feeds/' do 
      @category = "feeds"
      @category_title = @category
      haml File.join("/feeds/index").to_sym
    end

    get '/:category/' do 
      @category = params[:category]
      @category_title = params[:category]
      @items = Metadata.type(@category.to_sym).all.sort.inject({}) do |acc, item|
        acc[item.published.year] ||= {}
        acc[item.published.year][item.published.month] ||= []
        acc[item.published.year][item.published.month] << item
        acc
      end
      haml File.join(@category, "/index").to_sym
    end

    get '/:category/:name/' do 
      @category = params[:category]
      @category_title = params[:category].gsub(/(.+)s$/, '\1')
      @name = params[:name]
      haml File.join(@category, "/", @name, "/index").to_sym
    end

    get '/*/files/:filename.:filetype' do
      filetype = params[:filetype] == "zip" ? "zip" : "#{params[:filetype]}.txt"
      file = "#{options.views}/#{params[:splat]}/files/#{params[:filename]}.#{filetype}"
      if File.exists? file
        content_type 'text/plain', :charset => 'utf-8'
        send_file(file)
      else
        raise not_found
      end
    end

  end
end

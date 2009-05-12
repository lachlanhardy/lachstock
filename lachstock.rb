require 'rubygems'
require 'sinatra'
require 'haml'
require 'twitter'
require 'yaml'

require 'pp' # only for dev work


# homepage
get '/' do
  @category = "home"
  @folders = Dir.glob("views/*/")
  @items = filtered_filenames(Dir.glob("views/*/*"))
  view :index
end

get '/:category' do 
  @category = params[:category]
  @category_title = params[:category]
  @folders = Dir.glob("views/*/")
  view File.join(@category, "/index").to_sym
end

# getting tags from permanent urls
get '/:category/:name' do 
  @category = params[:category]
  @category_title = params[:category].gsub(/(.+)s$/, '\1')
  @name = params[:name]
  @folders = Dir.glob("views/*/")
  @items = filtered_filenames(Dir.glob("views/" + @category + "/*"))
  view File.join(@category, "/", @name, "/index").to_sym
end

helpers do
  def comment_avatars(username)
    # Twitter.user(username)[:profile_image_url].gsub(/_normal/, "") unless Twitter.user(username)
  end
  def comment_builder
    @comments = YAML::load(File.open("views/" + @category + "/" + @name + "/comments.yaml"))
    haml(:"_comments", :layout => false)
  end
  def filtered_filenames(paths)
    paths ||= []
    paths.collect { |path|
      path[/.+\/([^\/]+)\.haml$/, 1]
    }.reject { |name|
      name == "index"
    }
  end
  def view(view)
    haml view, :options => {:format => :html5,
                              :attr_wrapper => '"'}
  end
  def partial(name)
    haml(:"_#{name}", :layout => false)
  end
  def versioned_stylesheet(stylesheet)
    "/stylesheets/#{stylesheet}.css?" + File.mtime(File.join(Sinatra::Application.public, "stylesheets", "#{stylesheet}.css")).to_i.to_s
  end
  def versioned_javascript(js)
    "/javascripts/#{js}.js?" + File.mtime(File.join(Sinatra::Application.public, "javascripts", "#{js}.js")).to_i.to_s
  end
end


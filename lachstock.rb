require 'rubygems'
require 'sinatra'
require 'haml'

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
  view File.join(@category, "/", @name).to_sym
end

helpers do
  def filtered_filenames(paths)
    paths ||= []
    paths.collect { |path|
      path[/.+\/([^\/]+)\.haml$/, 1]
    }.reject { |name|
      name == "index" || name[/^hide\-/]
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


require 'rubygems'
require 'sinatra'
require 'haml'
require 'twitter'
require 'yaml'

require 'pp' # only for dev work

load "#{File.dirname(__FILE__)}/lib/metadata.rb"

# homepage
get '/' do
  @category = "home"
  view :index
end

["/tags", "/tags/:tag", "/:category/tags", "/:category/tags/:tag"].each do |path|
  get path do
    @category = (params[:category].nil? ? "*" : params[:category])
    @category_title = (params[:tag].nil? ? "Tags" : "Tag")
    @tag = (params[:tag].nil? ? nil : params[:tag])
    @tags = tagspace(@tag, filtered_filenames(Dir.glob("views/#{@category}/*")))
    view :tagspace
  end
end

get '/:category' do 
  @category = params[:category]
  @category_title = params[:category]
  @items = Metadata.type(@category.to_sym).all.sort.inject({}) do |acc, item|
    acc[item.published.year] ||= {}
    acc[item.published.year][item.published.month] ||= []
    acc[item.published.year][item.published.month] << item
    acc
  end
  view File.join(@category, "/index").to_sym
end

get '/:category/:name' do 
  @category = params[:category]
  @category_title = params[:category].gsub(/(.+)s$/, '\1')
  @name = params[:name]
  view File.join(@category, "/", @name, "/index").to_sym
end

# Hot redirect for consistent URLs
get '*/' do
  redirect params[:splat].to_s
end

helpers do
  def prettify_date(base)
    Time.parse(base.gsub(/(.+)\sat\s(.+)/, '\1\2')).strftime("%H%Mh %A, %d %B %Y")    
  end
  def comment_builder
    unless @name.nil?
      if File.exist? "#{options.views}/#{@category}/#{@name}/comments.yaml"
        @comments = YAML.load_file("views/#{@category}/#{@name}/comments.yaml")
        haml(:"_comments", :layout => false)
      end
    end
  end
  def comment_avatars(username)
    # Twitter.user(username)[:profile_image_url].gsub(/_normal/, "") unless Twitter.user(username)
  end
  def filtered_filenames(paths)
    paths ||= []
    paths.collect { |path|
      path.split("/").last
    }.reject { |name|
      name == "index.haml" || name == "test"
    }
  end
  
  def nav_builder
    @nav_items = ["articles", "tags", "about"]
    haml(:"_navigation", :layout => false)
  end
  
  def tagspace(tag, folders)
    @directories = []
    tag_list = [] 
    
    if @category == "*"
      Dir.glob("views/*").each do |contents|
        if (File.ftype(contents) == "directory")
          @directories.push(contents.split("/").last)
        end
      end
    else
      @directories.push(@category)
    end
    
    @directories.each do |directory|
      folders.each do |folder|
        if File.exist? "#{options.views}/#{directory}/#{folder}/tags.yaml"
          if tag.nil?
            tag_list = tag_list | YAML.load_file("#{options.views}/#{directory}/#{folder}/tags.yaml")
          else
            if (YAML.load_file("#{options.views}/#{directory}/#{folder}/tags.yaml").include?(tag))
              tag_list.push(directory + "/" + folder)
            end
          end
        end
      end
    end
    return tag_list.sort_by {|item| item.downcase}
  end
  
  def tag_builder
    unless @name.nil?
      if File.exist? "#{options.views}/#{@category}/#{@name}/tags.yaml"
        @tags = YAML.load_file("views/#{@category}/#{@name}/tags.yaml").sort_by {|tag| tag.downcase}
        haml(:"_tags", :layout => false)
      end
    end
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
  def versioned_favicon
    "/favicon.ico?" + File.mtime(File.join(Sinatra::Application.public, "favicon.ico")).to_i.to_s
  end
end


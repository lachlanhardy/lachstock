module Lachstock
  module Helpers
    def handle_fail
      @category = "articles"
      @category_title = "Error"
      @name = nil
      @items = Metadata.type(@category.to_sym).all.sort.inject({}) do |acc, item|
        acc[item.published.year] ||= {}
        acc[item.published.year][item.published.month] ||= []
        acc[item.published.year][item.published.month] << item
        acc
      end
      @tags = tagspace(nil, Metadata.type(@category.to_sym).all)
      haml :error
    end
    def render_html(item)
      haml(item, :layout => false)
    end
    def make_base_date(date)
      Time.parse(date.gsub(/(.+)\sat\s(.+)/, '\1\2'))
    end
    def atomify_date(date)
      date.strftime("%Y-%m-%dT%H:%M:%SZ")
    end
    def prettify_base_date(base)
      make_base_date(base).strftime("%H%Mh %A, %d %B %Y")    
    end
    def prettify_date(date)
      date.strftime("%H%Mh %A, %d %B %Y")    
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
      Dir.glob("#{options.public}/images/avatars/#{username}*")[0].split("/").last
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
          article = folder.path.split("/")[-2]
          if File.exist? "#{options.views}/#{directory}/#{article}/tags.yaml"
            if tag.nil?
              tag_list = tag_list | (YAML.load_file("#{options.views}/#{directory}/#{article}/tags.yaml"))
            else
              if (YAML.load_file("#{options.views}/#{directory}/#{article}/tags.yaml").include?(tag))
                tag_list.push([directory + "/" + article, folder.title, (folder.updated || folder.published)])
              end
            end
          end
        end
      end
      return tag_list.sort_by {|item| item.kind_of?(Array) ? item[2] : item.downcase}
    end

    def tag_builder
      unless @name.nil?
        if File.exist? "#{options.views}/#{@category}/#{@name}/tags.yaml"
          @tags = YAML.load_file("views/#{@category}/#{@name}/tags.yaml").sort_by {|tag| tag.downcase}
          haml(:"_tags", :layout => false)
        end
      end
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
end
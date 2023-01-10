module Lachstock
  module Helpers
    def comment_builder
      unless @name.nil?
        if File.exist? "#{settings.views}/#{@category}/#{@name}/comments.yaml"
          @comments = YAML.load_file("views/#{@category}/#{@name}/comments.yaml")
          haml(:"_comments", :layout => false)
        end
      end
    end
    def comment_avatars(username)
      Dir.glob("#{settings.public_folder}/images/avatars/#{username}*")[0].split("/").last
    end
  end
end

module Lachstock
  module Helpers
    def tag_builder
      unless @name.nil?
        if File.exist? "#{options.views}/#{@category}/#{@name}/tags.yaml"
          @tags = YAML.load_file("views/#{@category}/#{@name}/tags.yaml").sort_by {|tag| tag.downcase}
          haml(:"_tags", :layout => false)
        end
      end
    end
  end
end
module Lachstock
  module Helpers
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
          item = folder.path.split("/")[-2]
          tag_file_path = "#{options.views}/#{directory}/#{item}/tags.yaml"
          if File.exist? tag_file_path
            if tag.nil?
              # tag_list = tag_list | (YAML.load_file("#{options.views}/#{directory}/#{item}/tags.yaml"))
              tag_list.concat(YAML.load_file(tag_file_path))
            else
              if (YAML.load_file(tag_file_path).include?(tag))
                tag_list.push([directory + "/" + item, folder.title, (folder.updated || folder.published)])
              end
            end
          end
        end
      end
      
      if tag.nil?
        tag_counter = tag_list.map do |tag| 
          count = 0
          tag_list.each do |item|
            if (item == tag)
              count = count + 1
            end
          end
          [tag, count]
        end
        tag_list.replace(tag_counter.uniq)
      end
      
      return tag_list.sort_by {|item| item.kind_of?(Array) ? item[0].downcase : item.downcase}
    end
  end
end

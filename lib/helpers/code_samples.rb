module Lachstock
  module Helpers
    def code_sample(filename)
      @filename = filename
      file = "#{settings.views}/#{@category}/#{@name}/files/#{filename}.txt"
      if File.exist? file
        @code_snippet= preserve(escape_once(File.read(file)))
        extension = filename.split('.')[1]
        @code_class = (extension == "js" ? "javascript" : extension)
      end
      haml(:"_code_sample", :layout => false)
    end

    def code_download
      file = "#{settings.views}/#{@category}/#{@name}/files/#{@name}.zip"
      if File.exist? file
        @download_url = "#{@name}.zip"
        haml(:"_code_download", :layout => false)
      end
    end
  end
end

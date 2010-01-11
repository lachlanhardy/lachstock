module Lachstock
  module Helpers
    def code_sample(filename)
      @filename = filename
      file = "#{options.views}/#{@category}/#{@name}/files/#{filename}.txt"
      if File.exist? file
        @code_snippet= escape_once(File.read(file))
        extension = filename.split('.')[1]
        @code_class = (extension == "js" ? "javascript" : extension)
      end
      haml(:"_code_sample", :layout => false)
    end
  end
end
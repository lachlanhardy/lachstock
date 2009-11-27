namespace :minifier do
 
  def minify(files)
    files.each do |file|
      file_path = "public/#{file.split("/")[1]}/minified/#{file.split("/")[2]}"
      github_path = "http://github.com/lachlanhardy/lachstock/blob/master/public/#{file.split("/")[1]}/#{file.split("/")[2]}"
      
      cmd = "java -jar lib/yuicompressor-2.4.2.jar #{file} -o #{file_path}"
      puts cmd
      ret = system(cmd)
      File.open(file_path, "r+") {|f| f.write("/*\n   For readable source code, check the 'hubs: \n   #{github_path} \n*/\n\n" + File.read(file_path))}
      raise "Minification failed for #{file}" if !ret
    end
  end
 
  desc "minify"
  task :minify => [:minify_js, :minify_css]
 
  desc "minify javascript"
  task :minify_js do
    minify(FileList['public/javascripts/*.js'])
  end
 
  desc "minify css"
  task :minify_css do
    minify(FileList['public/stylesheets/*.css'])
  end
  
end


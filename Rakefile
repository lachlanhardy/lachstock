namespace :minifier do
 
  def minify(files)
    files.each do |file|
      cmd = "java -jar lib/yuicompressor-2.4.2.jar #{file} -o public/#{file.split("/")[1]}/minified/#{file.split("/")[2]}"
      puts cmd
      ret = system(cmd)
      raise "Minification failed for #{file}" if !ret
    end
  end
 
  desc "minify"
  task :minify => [:minify_js, :minify_css]
 
  desc "minify javascript"
  task :minify_js do
    minify(FileList['public/javascripts/**/*.js'])
  end
 
  desc "minify css"
  task :minify_css do
    minify(FileList['public/stylesheets/**/*.css'])
  end
  
end


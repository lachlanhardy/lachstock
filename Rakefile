task :deploy => "minifier:check" do
  puts "deploy"
  cmd = 'cap deploy'
  puts cmd
  ret = system(cmd)
  raise "guck it" if !ret
end

namespace :minifier do
  
  desc "check"
  task :check do
    raise "You've uncommitted changes" unless `git status`.include?("working directory clean")
    `rake minifier:minify && git commit -am "Minifying changed JS & CSS for production" && git push origin master`
  end
 
  def minify(file, file_type)
    file_path = "#{file.gsub(file.split("/")[-1], "")}"
    github_path = "http://github.com/lachlanhardy/lachstock/blob/master/public/#{file.split("/")[1]}/"
    output_path = "#{file_path}minified.#{file_type}"
    
    cmd = "java -jar lib/yuicompressor-2.4.2.jar #{file} -o #{output_path}"
    puts cmd
    ret = system(cmd)
    File.open(output_path, "r+") {|f| f.write("/* For readable source code, check the 'hubs: \n   #{github_path}  */\n\n" + File.read(output_path))}
    raise "Minification failed for #{file}" if !ret
  end
  
  def combine(folder_path, file_type)
    cmd = "java -jar lib/combiner-0.0.1.jar -o #{folder_path}/production/combined.#{file_type} #{folder_path}*.#{file_type}"
    puts cmd
    ret = system(cmd)
  end
 
  desc "minify"
  task :minify => [:minify_js, :minify_css]
 
  desc "minify javascript"
  task :minify_js do
    puts "js"
    file_type = "js"
    combine("public/javascripts/", file_type)
    minify('public/javascripts/production/combined.js', file_type)
  end
 
  desc "minify css"
  task :minify_css do
    puts "css"
    file_type = "css"
    combine("public/stylesheets/", file_type)
    minify('public/stylesheets/production/combined.css', file_type)
  end
  
end


def get_new_avatars(userlist_path)
  httpauth = Twitter::HTTPAuth.new('lachstock', 'WorldDom09')
  base = Twitter::Base.new(httpauth)

  YAML.load_file(userlist_path).each do |username|
    if Dir.glob("public/images/avatars/#{username}*")[0].nil?
      image_path = base.user(username)[:profile_image_url].gsub(/http:\/\/s3.amazonaws.com/, "").gsub(/_normal/, "_bigger") unless !base.user(username)

      h = Net::HTTP.new('s3.amazonaws.com', 80)
      resp, data = h.get(image_path, nil)
      if resp.message == "OK"
        File.open("public/images/avatars/#{username}.#{image_path.split(".").last}", "wb+") do |f|
          f << data
        end
      end
    end
  end
end

def configure_avatars(userlist_path)
  unless userlist_path.nil?
    get_new_avatars(userlist_path)
  else
    @directories = []
    comments = []
    usernames = []

    Dir.glob("views/*").each do |contents|
      if (File.ftype(contents) == "directory")
        @directories.push(contents.split("/").last)
      end
    end

    @directories.each do |directory|
      Dir.glob("views/#{directory}/*").each do |folder|
        item = folder.split("/")[-1]
        if File.exist? "views/#{directory}/#{item}/comments.yaml"
          comments = comments | (YAML.load_file("views/#{directory}/#{item}/comments.yaml"))
        end
      end
    end

    comments.each do |comment|
      unless comment['username'].nil?
        usernames.push(comment['username'])
      end
    end

    File.open('public/images/userlist.yaml', 'w') { |f| f.puts usernames.uniq!.sort.to_yaml }
    get_new_avatars(Dir.glob("public/images/userlist.yaml")[0])
  end
end
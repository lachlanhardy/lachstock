module Lachstock
  module Helpers
    def versioned_stylesheet(stylesheet)
      "/stylesheets/#{stylesheet}.css?" + File.mtime(File.join(Sinatra::Application.public_folder, "stylesheets", "#{stylesheet}.css")).to_i.to_s
    end

    def versioned_javascript(js)
      "/javascripts/#{js}.js?" + File.mtime(File.join(Sinatra::Application.public_folder, "javascripts", "#{js}.js")).to_i.to_s
    end

    def versioned_favicon
      "/favicon.ico?" + File.mtime(File.join(Sinatra::Application.public_folder, "favicon.ico")).to_i.to_s
    end
  end
end

module Lachstock
  module Helpers
    def versioned_stylesheet(stylesheet)
      directory = options.environment == :production ? "stylesheets/minified" : "stylesheets"
      "/#{directory}/#{stylesheet}.css?" + File.mtime(File.join(Sinatra::Application.public, "stylesheets", "#{stylesheet}.css")).to_i.to_s
    end
    def versioned_javascript(js)
      directory = options.environment != :production ? "javascripts/minified" : "javascripts"
      "/#{directory}/#{js}.js?" + File.mtime(File.join(Sinatra::Application.public, "javascripts", "#{js}.js")).to_i.to_s
    end
    def versioned_favicon
      "/favicon.ico?" + File.mtime(File.join(Sinatra::Application.public, "favicon.ico")).to_i.to_s
    end
  end
end
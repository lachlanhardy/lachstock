module Lachstock
  module Helpers
    def filtered_filenames(paths)
      paths ||= []
      paths.collect { |path|
        path.split("/").last
      }.reject { |name|
        name == "index.haml" || name == "test"
      }
    end
  end
end
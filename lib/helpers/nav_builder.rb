module Lachstock
  module Helpers
    def nav_builder
      @nav_items = ["articles", "tags", "about"]
      haml(:"_navigation", :layout => false)
    end
  end
end
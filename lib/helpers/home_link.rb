module Lachstock
  module Helpers
    def home_link(text)
      (@category == "home" ? '<span class="pure-menu-selected">' + text + '</span>' : '<a href="/" rel="home">' + text + '</a>')
    end
  end
end
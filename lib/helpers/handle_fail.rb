module Lachstock
  module Helpers  
    def handle_fail
      @category = "articles"
      @category_title = "Error"
      @name = nil
      @items = Metadata.type(@category.to_sym).all.sort.inject({}) do |acc, item|
        acc[item.published.year] ||= {}
        acc[item.published.year][item.published.month] ||= []
        acc[item.published.year][item.published.month] << item
        acc
      end
      haml :error
    end
  end
end
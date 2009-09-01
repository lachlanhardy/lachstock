class Metadata
  # I cargo culted this class from Tim Lucas's work on his own blog.
  # I've modified it a bit, but I still don't understand all of it.
  # You can find the original here:
  # http://github.com/toolmantim/toolmantim/blob/f479d008806ca2ae8f0028543c8f693b69bcc329/lib/article.rb
  
  def self.all
    self.files.collect {|f| new(f, File.read(f))}
  end
  def self.files
    Dir.glob(File.expand_path("views/*/*/index.haml"))
  end
  def self.path=(path)
    @path = path
  end
  def self.path(article_slug=nil)
    article_slug ? File.join(@path, "#{article_slug}.haml") : @path
  end
  def self.[](slug)
    path = path(slug)
    File.exist?(path) && new(path, File.read(path))
  end
  def self.template_variable(text, name)
    text[/-\s@#{name}\s=\s"(.+)"/, 1]
  end
  def self.parse_date(date_string)
    date_string && Time.parse(date_string.gsub(/(.+)\sat\s(.+)/, '\1\2'))
  end
  
  attr_reader :path, :template
  
  def initialize(file_path, file_contents)
    @path = file_path
    @template = file_contents
  end
  def slug
    File.basename(File.join("#{self.path.split("/")[-3]}/#{self.path.split("/")[-2]}"))
  end
  alias :dom_id :slug
  def title
    template_variable("title")
  end
  def blurb
    template_variable("blurb")
  end
  def published
    @published ||= self.class.parse_date(template_variable("published"))
  end
  def updated
    @updated ||= self.class.parse_date(template_variable("updated"))
  end
  def last_modified
    updated || published
  end
  def template_variable(name)
    self.class.template_variable(self.template, name)
  end
  def <=>(other)
    [other.published.year, other.published.month, other.title] <=> [self.published.year, self.published.month, self.title]
  end
  def ==(other)
    other.respond_to?(:slug) && self.slug == other.slug
  end
  def path_without_extension
    self.path.sub(".haml", "")
  end
  def self.type(type)
    Class.new(self).class_eval <<-CODE
      def self.files
        Dir.glob(File.expand_path("views/#{type}/*/index.haml"))
      end
      self
    CODE
  end
end
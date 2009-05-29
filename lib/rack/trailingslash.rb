class TrailingSlash
  def initialize(app)
    @app = app
  end
  def call(env)
    get %r{(^\S+[^\/](?=\s|$))} do
      redirect "#{params[:captures].to_s}/", 301
    end
    @app.call(env)  
  end
end

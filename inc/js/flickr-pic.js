
function flickrPic() {
    $.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?tags=lachlanhardy&format=json&jsoncallback=?",
        function(data){
            var arr = jQuery.makeArray(data);
            var rndNum = Math.ceil(Math.random() * (data.items.length - 1));
            var item = data.items[rndNum];
            
            var img = $("<img/>").attr("src", item.media.m);
            $("<a/>")
                .attr("href", item.link)
                .append(img)
                .appendTo("#flickr-pic");
                
            var author = item.author;
            author = author.match(/\(([a-zA-z0-9 *]*)\)/);
            
            var attributionLink = $("<a/>")
                                            .attr("href", item.link)
                                            .append("Image by " + author[1]);
            
            $("<p/>")
                    .addClass("attribution")
                    .append(attributionLink)
                    .appendTo("#flickr-pic");
        });
}

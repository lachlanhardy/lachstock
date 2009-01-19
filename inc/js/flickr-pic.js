
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
        });
}

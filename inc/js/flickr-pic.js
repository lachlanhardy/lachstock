
function flickrPic() {
    $.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?tags=lachlanhardy&tagmode=any&format=json&jsoncallback=?",
        function(data){
          $.each(data.items, function(i,item){
            var img = $("<img/>").attr("src", item.media.m);
            $("<a/>").attr("href", item.link).append(img).appendTo("#flickr-pic");
            if ( i == 0 ) return false;
          });
        });
}

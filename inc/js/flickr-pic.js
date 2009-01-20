function flickrPic() {
    $.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?tags=lachlanhardy&format=json&jsoncallback=?",
        function(data){
            var arr = jQuery.makeArray(data);
            var rndNum = Math.ceil(Math.random() * (data.items.length - 1));
            var item = data.items[rndNum];
            
            $("<a/>")
                .attr("href", item.link)
                .attr("id", "polaroid")
                .prependTo("#flickr-pic");
            
            var imgWidth = parseInt(item.description.match(/width="(\d*)/)[1], 10);
            var imgHeight = parseInt(item.description.match(/height="(\d*)/)[1], 10);
                       
            var paperWidth = (imgWidth + 40);
            var paperHeight = (imgHeight + 60);
                
            var r = Raphael("polaroid", paperWidth + 100, paperHeight + 100);
            
            r.rect(55, 63, paperWidth, paperHeight).attr({
              fill: "#000",
              opacity: .15,
              stroke: "#000",
              "stroke-width": 4,
              "stroke-opacity": .3
            }).rotate(10);

            r.rect(50, 55, paperWidth, paperHeight).attr({
              fill: "#fff",
              stroke: "#ddd",
              "stroke-width": 2,
              "stroke-opacity": .3
            }).rotate(11);   

            r.image(item.media.m, 70, 75, imgWidth, imgHeight).rotate(11);
            
            var author = item.author;
            author = author.match(/\(([a-zA-z0-9 *]*)\)/);
            
            r.text(paperWidth - 70, paperHeight + 40, "Image: " + author[1])
                .attr({"font": '700 10px "Zapfino", "Marker Felt", "Papyrus", "URW Chancery L"'})
                .rotate(9);
            
            var refreshLink = $("<a/>").text("Try another image.")
                                       .attr("href", "#refresh")
                                       .click(function(e){
                                           $("#flickr-pic p span").remove();
                                           refreshLink.remove();
                                           r.remove();
                                           flickrPic();
                                           e.preventDefault();
                                       });
            
            $("#flickr-pic p").append(" <span>Not me?</span> ").append(refreshLink);
            
        });
}

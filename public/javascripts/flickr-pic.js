/*requires github-activity.js*/

(function($){  
    $.fn.flickrPolaroid = function(options) {  

        var defaults = {tags: "lachlanhardy"},
            options = $.extend(defaults, options);

        return this.each(function() {  
            var $canvas = $(this);
            
            function flickrPic(data) {

                var arr = jQuery.makeArray(data),
                    rndNum = Math.ceil(Math.random() * (data.items.length - 1)),
                    item = data.items[rndNum],
                    imgWidth = parseInt(item.description.match(/width="(\d*)/)[1], 10),
                    imgHeight = parseInt(item.description.match(/height="(\d*)/)[1], 10),
                    paperWidth = (imgWidth + 40),
                    paperHeight = (imgHeight + 60),
                    rotations = [2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18],
                    rotation = Math.ceil(Math.random() * (rotations.length - 1)),
                    author = item.author.match(/\(([a-zA-z0-9 *]*)\)/),
                    $refreshLink = $("<a/>"),
                    r;

                $("<a/>").attr({
                  href: item.link,
                  id: "polaroid"
                }).prependTo($canvas);

                r = Raphael("polaroid", paperWidth + 100, paperHeight + 100)

                r.rect(55, 63, paperWidth, paperHeight).attr({
                  fill: "#000",
                  opacity: .15,
                  stroke: "#000",
                  "stroke-width": 4,
                  "stroke-opacity": .3
                }).rotate(rotations[rotation] - 1);

                r.rect(50, 55, paperWidth, paperHeight).attr({
                  fill: "#fff",
                  stroke: "#ddd",
                  "stroke-width": 2,
                  "stroke-opacity": .3
                }).rotate(rotations[rotation]);   

                $canvas.css("margin", "-1.5em 0 1em 0");
                r.image(item.media.m, 70, 75, imgWidth, imgHeight).rotate(rotations[rotation]);

                r.text(paperWidth - 85, paperHeight + 40, "Taken by " + author[1])
                 .attr({"font": '700 10px "Zapfino", "Marker Felt", "Papyrus", "URW Chancery L"'})
                 .rotate(rotations[rotation] - 2);

                $refreshLink.attr({
                  id: "refresh-link",
                  href: "#refresh"
                }).text("Try another image?")
                  .click(function(e){
                    $canvas.css("margin", "0 0 1em 0");
                    $refreshLink.remove();
                    r.remove();
                    flickrPic(data);
                    e.preventDefault();
                  });
                $("p", $canvas).append($refreshLink);
            }

            function callFlickr() {
            $.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?tags=" + options.tags +" &format=json&jsoncallback=?",
                function(data){
                    $("#polaroid").add("#refresh-link").remove();
                    flickrPic(data);
                });
            };
            callFlickr();
            setInterval(callFlickr, 36000000); // 10 hourly updates - like we need it!
        });  
    };  
})(jQuery);

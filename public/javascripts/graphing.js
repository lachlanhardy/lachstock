/*requires g.pie-min.js*/

var drawGraphs = function () {
  if ($("ul.taglist").length != 0) {

    // grab the data values from the page 
    var tags = [],
        tag_count = [],
        tag_label = [],
        tag_href = [];
    $("a:not(.common)", "ul.taglist").each(function(i) {
      var $tag = $(this);
      tags.push({value: parseFloat($tag.attr("data-tag_count")), text: $tag.text(), href: $tag.attr("href")});
    });
    
    // structure the data
    tags = tags.sort(function (a, b) {
      return b.value - a.value;
    }).splice(0, 10);
    for (var i=0, ii = tags.length; i < ii; i++) {
      tag_count.push(tags[i].value);
      tag_label.push("%% - " + tags[i].text);
      tag_href.push(tags[i].href);
    }
    
    // Create a canvas
    $("<div id=\"graph\"/>").insertAfter($("h1", "#tagspace"));
    var r = Raphael("graph", "30em", "16em");
    
    // Draw piechart
    var pie = r.g.piechart(300, 120, 100, tag_count, {legend: tag_label, legendpos: "west", href: tag_href});
    pie.labels.attr({font: '1.1em "Helvetica Neue"', translation: "-50 0"});

    // Assign hrefs to legend labels
    $(pie.labels).each(function (i) {
      pie.labels[i].attr({href: tag_href[i]});
    });

    // Set up funky hover states
    pie.hover(function () {
        this.sector.stop();
        this.sector.animate({scale: [1.1, 1.1, this.cx, this.cy]}, 500, "elastic");
        if (this.label) {
            this.label[0].stop();
            this.label[0].animate({scale: 1.5}, 250);
            this.label[1].attr({fill: "#ff8000"});
        }
    }, function () {
        this.sector.animate({scale: [1, 1, this.cx, this.cy]}, 500, "bounce");
        if (this.label) {
            this.label[0].animate({scale: 1}, 250);
            this.label[1].attr({fill: "#000"});
        }
    });
  }
};
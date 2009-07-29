var drawGraphs = function () {
  if ($("ul.taglist").length != 0) {

    var tags = [],
      tag_count = [],
      tag_label = [],
      tag_href = [];
    $("a:not(.common)", "ul.taglist").each(function(i) {
      var $tag = $(this);
      tags.push({value: parseFloat($tag.attr("data-tag_count")), text: $tag.text(), href: $tag.attr("href")});
    });
    
    tags = tags.sort(function (a, b) {
      return b.value - a.value;
    }).splice(0, 10);
    for (var i=0, ii = tags.length; i < ii; i++) {
      tag_count.push(tags[i].value);
      tag_label.push("%% - " + tags[i].text);
      tag_href.push(tags[i].href);
    }
    
    $("#tagspace").append($("<div id=\"graph\"/>"));
    var r = Raphael("graph", "30em", "16em");
    var pie = r.g.piechart(300, 120, 100, tag_count).attr({stroke: "#FFF"});
    pie.legend(tag_label, "%%.%% others").moveLegend("west");
    pie.labels.attr({font: '1.1em "Helvetica Neue"', translation: "-50 0"});

    // for (var j=0, ii = pie.covers.length; j < ii; j++) {
    //   pie.covers[j].attr("href", tag_href[j]);
    // };
    
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
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
    
    var r = Raphael("graph", "30em", "16em");
    var pie = r.g.piechart(120, 120, 100, tag_count);
    pie.legend(tag_label, "%%.%% others");
    pie.hover(function () {
        if (!this.note) {
            pie.inject(this.note = r.g.blob(this.mx, this.my, (this.value * 100 / this.total).toFixed(2) + "%", this.mangle).attr({opacity: 0}));
        }
        this.note.animate({opacity: 1}, 200);
        this.sector.stop();
                this.sector.scale(1.1, 1.1, this.cx, this.cy);
                if (this.label) {
                    this.label[0].stop();
                    this.label[0].scale(1.5);
                    this.label[1].attr({"font-weight": 800});
                }
    }, function () {
        this.note && this.note.animate({opacity: 0}, 200);
        this.sector.animate({scale: [1, 1, this.cx, this.cy]}, 500);
                if (this.label) {
                    this.label[0].animate({scale: 1}, 500);
                    this.label[1].attr({"font-weight": 400});
                }
    });
    // var labels = ["Accessibility – ##", "Adobe – ##", "Advertising – ##", "Ajax – ##", "Android", "Apple", "Aptana", "Articles", "Atlas", "Bespin", "Book Reviews", "Bookmarklets", "Books", "Browsers", "Builds", "Business", "Calendar", "Canvas", "Cappuccino", "Chat", "Chrome", "Cloud", "ColdFusion", "Comet", "Component", "Conferences", "Contests", "CSS", "Database", "Debugging", "Design", "Dojo", "DWR", "Editorial", "Email", "Examples", "Ext", "Firefox", "Flash", "Framework", "Fun", "Games", "Gears", "Google", "GWT", "HTML", "IE", "Interview", "iPhone", "Java", "JavaScript", "jMaki", "jQuery", "JSON", "Library", "LiveEdit", "LiveSearch", "Mac", "Mapping", "Microformat", "Microsoft", "Mobile", "MooTools", "Mozilla", "Office", "Offline", "OpenAjax", "OpenWebPodcast", "Opera", "Performance", "Perl", "PHP", "Plugins", "Podcasts", "Portal", "Pragmatic Ajax", "Presentation", "Programming", "Prototype", "Python", "Qooxdoo", "Rails", "Recording", "Remoting", "RichTextWidget", "Roundup", "Ruby", "Runtime", "Safari", "Screencast", "Scriptaculous", "Security", "Server", "Showcase", "Social Networks", "Sound", "Standards", "Storage", "Survey", "SVG", "Testing", "The Ajax Experience", "TIBCO", "Tip", "Titanium", "Toolkit", "Tutorial", "UI", "Unobtrusive JS", "Usability", "Utility", "Video", "W3C", "Web20", "Widgets", "Workshop", "XmlHttpRequest", "Yahoo!"];
   
    // r.g.barchart(600, 10, 320, 400, [[55, 20, 13, 32, 5, 1, 2, 10], [10, 2, 1, 5, 32, 13, 20, 55], [12, 20, 30]], 0, "sharp").hover(function () {
    //      this.flag = r.g.flag(this.bar.x, this.bar.y, this.value || "0", 10);
    //  }, function () {
    //      this.flag.animate({opacity: 0}, 100, function () {this.remove();});
    //  });

    // r.g.barchart(600, 420, 320, 200, [[55, 20, 13, 32, 5, 1, 2, 10]], 1).hover(function () {
    //      this.flag = r.g.blob(this.bar.x + this.bar.w / 2, this.bar.y, this.value || "0", 30);
    //  }, function () {
    //      this.flag.animate({opacity: 0}, 100, function () {this.remove();});
    //  });

    // r.g.barchart(600, 300, 320, 300, [55, 20, 13, 32, 5, 1, 2, 10, 9, 15], false, "round", "25%").label(null, true).attr({stroke: "hsb(.6, .2, .9)", fill: "hsb(.6, .2, .9)", "fill-opacity": .35});
    // var b = r.g.blob(320, 240, "12", 45).attr([{fill: "#fff", stroke: "#000"}, {fill: "#000", "font-size": 30}]).update();
    // var b = r.g.flag(320, 240, "12");
    // "a", 50, 50, 0, 0, 1, 100 + 100 * Math.cos(45 * Math.PI / 180), 100 - 100 * Math.sin(45 * Math.PI / 180)
    // .707
    // r.g.dropNote(400, 240, 444, "", 50, 45);
    // r.g.dropNote(320, 240, 12, 0, 0, -90);

  }    
};
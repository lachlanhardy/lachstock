/*requires status.js*/

var addRSSbutton = function() {
  var $rssLink = $("#rss-button"),
      paper = Raphael("rss-button", "60", "60"),
      icon = paper.set();

  $rssLink.children("span").hide();
  $rssLink.css({
    background: "transparent",
    margin: 0,
    width: "51px"
  });
  icon.push(
    paper.circle(8, 50, 8), 
    paper.path("M38.777, 58.5 H27.412 c0-15.139-12.273-27.412-27.412-27.412 l0, 0 V19.723 C21.416, 19.723, 38.777, 37.083, 38.777, 58.5z"), 
    paper.path("M46.8, 58.5 c0-25.847-20.953-46.8-46.8-46.8 V0 c32.308, 0, 58.5, 26.191, 58.5, 58.5 H46.8z")
  ).attr({
    fill : "#fff",
    stroke : "#fff"
  });
};
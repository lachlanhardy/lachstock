/*requires status.js*/

var addFeedButton = function() {

  // Declaring variables
  var $feedLink = $("#feed-button"), // The original anchor as a jQuery object
      paper = Raphael("feed-button", "60", "60"), // Creating the Raphaël canvas
      icon = paper.set(); // Creating a Raphaël set to hold common attributes for the icon

  $feedLink.children("span").hide(); // Clearing away the anchor text
  $feedLink.css({ // Modifying some styles to match what I want to do with the graphic
    background: "transparent",
    margin: 0,
    width: "51px"
  });
  icon.push( // Adding the components of the icon to the Raphaël set
    paper.circle(8, 50, 8), // The dot of the icon
    paper.path("M38.777, 58.5 H27.412 c0-15.139-12.273-27.412-27.412-27.412 l0, 0 V19.723 C21.416, 19.723, 38.777, 37.083, 38.777, 58.5z"), // The inner band
    paper.path("M46.8, 58.5 c0-25.847-20.953-46.8-46.8-46.8 V0 c32.308, 0, 58.5, 26.191, 58.5, 58.5 H46.8z") // The outer band
  ).attr({ // Setting the attributes of the set (and thus each component) to make it all white
    fill : "#fff",
    stroke : "#fff"
  });
};
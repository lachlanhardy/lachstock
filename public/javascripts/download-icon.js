/*requires flickr-pic.js*/

var downloadIcon = function() {
  if ($("#download")[0]) {

    // Declaring variables
    var $downloadLink = $("#download"), // The original anchor as a jQuery object
        paper = Raphael("download", "90", "120"), // Creating the Raphaël canvas
        icon = paper.set(); // Creating a Raphaël set to hold common attributes for the icon

    $downloadLink.children("span").hide(); // Clearing away the anchor text
    $downloadLink.css({
      display: "block",
      margin: "2em 0 0 0"
    });
    icon.push( // Adding the components of the icon to the Raphaël set
      paper.path("M0.667,45.164c-0.8,0-0.8,0.976-0.533,1.626l45.124,53.946c1.334,1.625,1.868,1.302,2.669,0L92.25,46.79c0.267-0.325,0.267-1.3-0.266-1.3H65.282V1.291c0-0.974-0.532-1.625-1.066-1.625H28.702c-0.8,0-1.335,0.651-1.335,1.625v43.873H0.667z"),
      paper.path("    M0.399,103.339c0-0.648,0.267-0.978,0.802-0.978h89.979c0.538,0,0.804,0.329,0.804,0.978v12.351c0,0.648-0.266,0.973-0.804,0.973H1.468c-0.534,0-0.802-0.324-0.802-0.973v-12.351H0.399z"),
      paper.path("      M0.667,45.164c-0.8,0-0.8,0.976-0.533,1.626l45.124,53.946c1.334,1.625,1.868,1.302,2.669,0L92.25,46.79c0.267-0.325,0.267-1.3-0.266-1.3H65.282V1.291c0-0.974-0.532-1.625-1.066-1.625H28.702c-0.8,0-1.335,0.651-1.335,1.625v43.873H0.667z")
    ).attr({ // Setting the attributes of the set (and thus each component) to make it all black
      fill : "#000",
      stroke : "#000"
    });
  }
};
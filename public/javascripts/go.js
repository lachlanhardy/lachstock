/*requires flickr-pic.js*/

$(document).ready(function(){
  // making sexy unobtrusive CSS possible since 2006
  $("html").addClass("js");

  addFeedButton();
  addTwitter();
  drawGraphs();
  $("#flickr-pic").flickrPolaroid();
  githubActivity();
});
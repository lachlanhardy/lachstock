/*requires download-icon.js*/

$(document).ready(function(){
  // making sexy unobtrusive CSS possible since 2006
  $("html").addClass("js");

  addFeedButton();
  downloadIcon();
  addTwitter();
  drawGraphs();
  $("#flickr-pic").flickrPolaroid();
  // githubActivity();
  
  
  var addClient = '<script src="http://gabbertalk.com/845c0a1287da5c09377574389f310931/bootstrap.js?client=false"></script>'
  $("body").append(addClient);

  
});
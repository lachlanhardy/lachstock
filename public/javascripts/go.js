$(document).ready(function(){
  // making sexy unobtrusive CSS possible since 2006
  $("html").addClass("js");
  
  // Adding some trickery for HTML 5 in IE
  document.createElement('header');
  document.createElement('footer');
  document.createElement('section');
  document.createElement('aside');
  document.createElement('nav');
  document.createElement('article');

  addTwitter();
  drawGraphs();
  $("#flickr-pic").flickrPolaroid();
  githubActivity();
  seinfeldBadge();
});
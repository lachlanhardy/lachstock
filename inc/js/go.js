$(document).ready(function(){
  // making sexy unobtrusive CSS possible since 2006
	$("html").addClass("js");
	
  addTwitter();
  githubActivity();
  // callFlickr();
  $("#flickr-pic").flickrPolaroid();
});
function twitterCallback2(json) {

  var status = document.createElement("strong");

  var twitters = json;
	var username = "";
  var tweetText = "";
  
  for (var i=0, ii = twitters.length; i<ii; i++){
    username = twitters[i].user.screen_name;
    
    tweetText = twitters[i].text;
        
    if (tweetText.substr(0,1) != "@"){
      
      // URL regex. I think that's everything, but it's probably not
      var urlRegex = /((ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?)/gi;
      var statusText = twitters[i].text.replace(urlRegex,'<a href="$1">$1</a>');
      
      var userRegex = /(\s@+[a-zA-Z_]{1,})/gi;
      statusText = statusText.replace(userRegex,'<a href="http://twitter.com/$1">$1</a>');
      
      var symRegex = /(http:\/\/twitter.com\/\s@)/gi;
      statusText = statusText.replace(symRegex, 'http://twitter.com/');
      
      $(status).html(statusText);  
      
      var statusLink = document.createElement("a"); 
      statusLink.href = "http://twitter.com/" + username + "/statuses/" + twitters[i].id;
      statusLink.id ="status-link";
      
      break;
    }
  }
  
  var twitterLogo = document.createElement("img");
  twitterLogo.alt = "link to status";
  twitterLogo.src = "inc/js/img/twitter-link.png";
  
  statusLink.appendChild(twitterLogo);

  var para = document.createElement("p");
  para.appendChild(status);
  para.appendChild(statusLink);

  var tweetStatus = document.createElement("div");
  tweetStatus.id = "status";
  tweetStatus.appendChild(para);
  
  var loadStatus = document.getElementById('status');
 
  $(loadStatus).replaceWith(tweetStatus);

}

var addTwitter = function(_) {
  // test URL
  var url = "test/lachlanhardy.json";
  //var url = "http://twitter.com/statuses/user_timeline/lachlanhardy.json?callback=twitterCallback2&count=10";
  var script = document.createElement('script');
  script.setAttribute('src', url);
  document.body.appendChild(script);
};
  	
$(document).ready(function(){
  // making sexy unobtrusive CSS possible since 2006
	$("html").addClass("js");
	
  addTwitter();
});



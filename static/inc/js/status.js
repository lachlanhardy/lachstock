function twitterCallback2(json) {

  var tweetStatus = document.createElement("div");
  tweetStatus.id = "status";

  var para = document.createElement("p");
  var status = document.createElement("strong");
  var tweetLink = document.createElement("a");

  var twitters = json;
	var username = "";

  for (var i=0, ii = twitters.length; i<ii; i++){
    username = twitters[i].user.screen_name;
        
    if (twitters[i].text.substr(0,1) != "@"){

      // URL regex. I think that's everything, but it's probably not
      var regexp = /((ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?)/gi;
      //var test = twitters[i].text.replace(regexp,'<a href="$1">$1</a>');
      
      var test = twitters[i].text.replace(regexp, '');
      var match = twitters[i].text.match(regexp);
      
      var statusLink = document.createElement("a");
      statusLink.href = match;
      statusLinkText = document.createTextNode(match);
      statusLink.appendChild(statusLinkText);
      
      statusText = document.createTextNode(test);  
 
      status.appendChild(statusText);
      status.appendChild(statusLink);
       
      // tweetLink.href = "http://twitter.com/" + username + "/statuses/" + twitters[i].id;
      break;
    }
  }

  para.appendChild(status);

  tweetStatus.appendChild(para);
  
  var loadStatus = document.getElementById('status');
 
  $(loadStatus).replaceWith(tweetStatus);

}

var addTwitter = function(_) {
  var url = "http://twitter.com/statuses/user_timeline/lachlanhardy.json?callback=twitterCallback2&count=5";
  var script = document.createElement('script');
  script.setAttribute('src', url);
  document.body.appendChild(script);
};
  	
$(document).ready(function(){
  addTwitter();
});



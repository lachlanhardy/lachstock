function twitterCallback2(json) {

  var tweetStatus = document.createElement("div");
  tweetStatus.id = "status";

  var para = document.createElement("p");
  var status = document.createElement("strong");
  var link = document.createElement("a");

  var twitters = json;
	var username = "";

  for (var i=0, ii = twitters.length; i<ii; i++){
    username = twitters[i].user.screen_name;
    
    var checkReply = twitters[i].text;
    checkReply = checkReply.substr(0,1);
    
    if (checkReply != "@"){
      statusText = document.createTextNode(twitters[i].text);     
      status.appendChild(statusText);
      // link.href = "http://twitter.com/" + username + "/statuses/" + twitters[i].id;
      i =  ii;
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



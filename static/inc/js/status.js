
function twitterCallback2(json) {

  var popetweets = document.createElement("div");
  popetweets.id = "popetweets";

  var para = document.createElement("p");
  var status = document.createElement("strong");
  var time = document.createElement("a");

  var twitters = json;
	var username = "";
	for (var i=0, ii = twitters.length; i<ii; i++){
		username = twitters[i].user.screen_name;

		statusText = document.createTextNode(twitters[i].text);
		status.appendChild(statusText);

		timeText = document.createTextNode(relative_time(twitters[i].created_at));
		time.appendChild(timeText);

		time.href = "http://twitter.com/" + username + "/statuses/" + twitters[i].id; 

	}

  para.appendChild(status);
  para.appendChild(time);

  popetweets.appendChild(para);

  var wrapper = document.getElementById('page');
  var wrapperParent = wrapper.parentNode;
  wrapperParent.insertBefore(popetweets, wrapper);

}

function relative_time(time_value) {
  var values = time_value.split(" ");
  time_value = values[1] + " " + values[2] + ", " + values[5] + " " + values[3];
  var parsed_date = Date.parse(time_value);
  var relative_to = (arguments.length > 1) ? arguments[1] : new Date();
  var delta = parseInt((relative_to.getTime() - parsed_date) / 1000);
  delta = delta + (relative_to.getTimezoneOffset() * 60);

  if (delta < 60) {
    return 'less than a minute ago';
  } else if(delta < 120) {
    return 'about a minute ago';
  } else if(delta < (60*60)) {
    return (parseInt(delta / 60)).toString() + ' minutes ago';
  } else if(delta < (120*60)) {
    return 'about an hour ago';
  } else if(delta < (24*60*60)) {
    return 'about ' + (parseInt(delta / 3600)).toString() + ' hours ago';
  } else if(delta < (48*60*60)) {
    return '1 day ago';
  } else {
    return (parseInt(delta / 86400)).toString() + ' days ago';
  }
}
  	var addTwitter = function(_) {
  		  var url = "http://twitter.com/statuses/user_timeline/lachlanhardy.json?callback=twitterCallback2&count=1";
        var script = document.createElement('script');
        script.setAttribute('src', url);
        document.body.appendChild(script);

  	};
  	
  		$(document).ready(function(){

           addTwitter();

         });
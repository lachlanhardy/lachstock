function twitterCallback2(json) {

  var status = $(document.createElement("strong"));
  var twitters = json;
  var username = "";
  var tweetText = "";
  
  for (var i=0, ii = twitters.length; i<ii; i++){
    username = twitters[i].user.screen_name;
    
    tweetText = twitters[i].text;
        
    if (tweetText.substr(0,1) != "@"){
      
      // URL regex. I think that's everything, but it's probably not
      var statusText = twitters[i].text.replace(/((ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?)/gi,'<a href="$1">$1</a>');
      
      // real comments
      statusText = statusText.replace(/(\s@+[a-zA-Z_]{1,})/gi,'<a href="http://twitter.com/$1">$1</a>');
      
      // real comments
      statusText = statusText.replace(/(http:\/\/twitter.com\/\s@)/gi, 'http://twitter.com/');
      
      $(status).html(statusText);  
      
      var statusLink = $("<a>Permalink</a>"); 
      statusLink.attr({
        href: "http://twitter.com/" + username + "/statuses/" + twitters[i].id,
        id: "status-link"
      });
      
      break;
    }
  }
  
  // just in case I've managed to do 10 replies without a straight-up tweet
  if (!$(status).text() == "") {
    var para = $(document.createElement("p"));
    para.append(status).append(statusLink);

    $("#status").empty().append(para);
  }
}

var addTwitter = function() {
    if ($("#status").length != 0) {
        var script = $(document.createElement("script"));
          script.attr("src", "http://twitter.com/statuses/user_timeline/lachlanhardy.json?callback=twitterCallback2&count=10");

          $("body").append(script);

    }
};

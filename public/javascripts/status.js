/*requires graphing.js*/

function twitterCallback2(json) {

  var $status = $("<strong/>"),
      twitters = json,
      $statusLink = $("<a>Permalink</a>"),
      $para = $("<p/>"),
      username,
      tweetText,
      statusText;
  
  for (var i=0, ii = twitters.length; i<ii; i++){
    username = twitters[i].user.screen_name;
    tweetText = twitters[i].text;
        
    if (tweetText.substr(0,1) != "@"){
      
      // URL regex. I think that's everything, but it's probably not
      statusText = twitters[i].text.replace(/((ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?)/gi,'<a href="$1">$1</a>');
      
      // real comments
      statusText = statusText.replace(/(\s@+[a-zA-Z_]{1,})/gi,'<a href="http://twitter.com/$1">$1</a>');
      
      // real comments
      statusText = statusText.replace(/(http:\/\/twitter.com\/\s@)/gi, 'http://twitter.com/');
      
      $status.html(statusText);
      
      $statusLink.attr({
        href: "http://twitter.com/" + username + "/statuses/" + twitters[i].id,
        id: "status-link"
      });
      
      break;
    }
  }
  
  // just in case I've managed to do 10 replies without a straight-up tweet
  if (!$status.text() == "") {
    $para.append($status).append($statusLink);
    $("#status").empty().append($para);
  }
}

var addTwitter = function() {
  if ($("#twitter-avatar")[0]) {

    var paper = Raphael("twitter-avatar", "100", "33"),
        bubbles = paper.set(),
        $script = $("<script/>").attr("src", "http://twitter.com/statuses/user_timeline/lachlanhardy.json?callback=twitterCallback2&count=10");

    // drawing bubbles
    bubbles.push(
        paper.circle(22, 9, 7),
        paper.circle(31, 18, 5),
        paper.circle(38, 24, 4),
        paper.circle(44, 29, 3)
      ).attr({
        fill : "#aaa",
        stroke : "transparent"
      });

    // Calling Twitter feed
    $("body").append($script);
  }
};

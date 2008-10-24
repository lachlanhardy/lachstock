function githubCallback(json) {

  var commits = json.user.repositories;
	var username = "lachlanhardy";
	var script = "";
	var comts = [];
  var repos = [];
  var sorter = function (a, b) {
    return a.committed_date <= b.committed_date ? 1 : -1;
  };
  
  var url = "";

 $.getJSON("http://pipes.yahoo.com/pipes/pipe.run?_id=VARThu_f3RGx59sz1b3fcQ&_render=json&username=" + username + "&_callback=?",
    function(feed){
      
      $(feed.value.items).each(function(i){
        var v = feed.value.items[i]['y:id'].value;
        var idValue = v.match(/([^\/]*):([^\/]*)\/([^\/]*)$/);
        var eventType = idValue[2];
        
        // only for CommitEvents right now - need to bust out other events as options
        switch(eventType) {
          case 'CommitEvent':
            if (url == "") {
              url = feed.value.items[i].link;
              titleText = " committed to ";
              return url;
              return titleText;
            }
            break;
          case 'FollowEvent':
            //
            break;
          case 'GistEvent':
            //
            break;
          case 'WikiEvent':
            //
            break;
        }
      });
      
      var v = url.match(/http:\/\/github.com\/([^\/]*)\/([^\/]*)\/commit\/([^\/]*)$/);
      
      var user = v[1];
      var repo = v[2];
      var id = v[3];
      var repoName = user + "/" + repo;
      
      $.getJSON("http://github.com/api/v1/json/" + repoName + "/commit/" + id + "?callback=?",
        function(data){
          
          var dl = $(document.createElement("dl"));
          var dt = $(document.createElement("dt"));
          var strong = $(document.createElement("strong"));
        
          var dtUser = $(document.createElement("a"));
          dtUser.attr("href", "http://github.com/" + username).text(username);
          strong.append(dtUser).append(titleText);
          
          var repoAnchor = $(document.createElement("a"));
          repoAnchor.attr("href", "http://github.com/" + repoName).text(repoName);
          strong.append(repoAnchor);
          
          var dateSpan = $(document.createElement("span"));
          var theDate = parseDate(data.commit.committed_date); // converts date to format Pretty Date recognises
          dateSpan.addClass("date").text(theDate).attr("title", theDate);
          dateSpan.prettyDate();
          setInterval(function(){ dateSpan.prettyDate(); }, 5000);
          
          // add STRONG and dateSpan to DT
          dt.append(strong).append(dateSpan);
          
          var ddMessage = $(document.createElement("dd"));
          messageAnchor = $(document.createElement("a"));
          messageAnchor.attr("href", url).text(data.commit.message);
          ddMessage.append(messageAnchor);
          
          var ddFilenames = $(document.createElement("dd"));
          ddFilenames.addClass("filenames");
          
          var filenamesUl = $(document.createElement("ul"));

          $(data.commit.modified).each(function(i){
            filenamesUl.append($(document.createElement("li")).text(data.commit.modified[i].filename));
          });
          ddFilenames.append(filenamesUl);
          
          dl.append(dt).append(ddMessage).append(ddFilenames);
          
          $("#github p").replaceWith(dl);
          
        } 
      );
    }
  );
}

function parseDate(theDate) {
  var timeZone = 10; // or "-3" as appropriate
  
  // TODO: need to add date changing functionality too
  theDate = theDate.substring(0,19) + "Z";
  var theirTime = theDate.substring(11,13);
  var ourTime = parseInt(theirTime) + 7 + timeZone;
  if (ourTime > 24) {
    ourTime = ourTime - 24;
  };
  theDate = theDate.replace("T" + theirTime, "T" + ourTime);
  return theDate;
};

var addGithub = function() {

  var mainScript = $(document.createElement("script"));
  mainScript.attr("src", "http://github.com/api/v1/json/lachlanhardy?callback=githubCallback");
  // mainScript.attr("src", "test/github.js");
  
  $("body").append(mainScript);
};

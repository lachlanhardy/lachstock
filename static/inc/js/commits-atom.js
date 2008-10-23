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
        if (eventType == "CommitEvent") {
          if (url == "") {
            url = feed.value.items[i].link;
            return url;
          }
        }
      });
      
      var v = url.match(/http:\/\/github.com\/([^\/]*)\/([^\/]*)\/commit\/([^\/]*)$/);
      
      var user = v[1];
      var repo = v[2];
      var id = v[3];
      $.getJSON("http://github.com/api/v1/json/" + user + "/" + repo + "/commit/" + id + "?callback=?",
        function(data){
          
          var dl = $(document.createElement("dl"));
          var dt = $(document.createElement("dt"));
          var dtAnchor = $(document.createElement("a"));
          dtAnchor.attr("href", url).text(data.commit.message);
          dt.append(dtAnchor);
          
          var ddRepo = $(document.createElement("dd"));
          ddRepo.addClass("repo");
          var ddRepoAnchor = $(document.createElement("a"));
          ddRepoAnchor.attr("href", "#").text("repo name");
          ddRepo.append(ddRepoAnchor);
          
          var ddFilenames = $(document.createElement("dd"));
          ddFilenames.addClass("filenames");
          
          var filenamesUl = $(document.createElement("ul"));

          $(data.commit.modified).each(function(i){
            filenamesUl.append($(document.createElement("li")).text(data.commit.modified[i].filename));
          });
          ddFilenames.append(filenamesUl);
          
          var ddDate = $(document.createElement("dd"));
          
          var theDate = parseDate(data.commit.committed_date);
          
          ddDate.addClass("date").text(theDate).attr("title", theDate);
          ddDate.prettyDate();
          setInterval(function(){ ddDate.prettyDate(); }, 5000);
          
          dl.append(dt).append(ddRepo).append(ddFilenames);
          dl.append(ddDate);
          
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

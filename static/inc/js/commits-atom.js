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
  
  $.ajax({
    url: "test/lachlanhardy.private.actor.atom",
    cache: false,
    success: function(xml){
      url = $("entry:first link", xml).attr("href");
      var v = url.match(/http:\/\/github.com\/([^\/]*)\/([^\/]*)\/commit\/([^\/]*)$/);
      alert(v); 
      
      var user = v[1];
      var repo = v[2];
      var id = v[3];
      // alert("http://github.com/api/v1/json/" + user + "/" + repo + "/commit/" + id + "?callback=?");
      $.getJSON("http://github.com/api/v1/json/" + user + "/" + repo + "/commit/" + id + "?callback=?",
        function(data){
          alert(data.commit.message);
           } 
         );
      
      // $("#results").append(xml);
    }
  });
  
  
    // 
    // 
    // $.each(commits, function(i){
    //   if (!commits[i]["private"]) {
    //     repos.push(commits[i]);
    //   }
    // });
    // 
    // $.each(repos, function(i){
    //     $.getJSON("http://github.com/api/v1/json/" + username + "/" + repos[i].name + "/commits/master?callback=?",
    //       function(data){
    //         data.commits.sort(sorter);
    //         data.commits[0].name = repos[i].name;
    //         data.commits[0].description = repos[i].description;
    //         data.commits[0].repoURL = repos[i].url;
    //         comts.push(data.commits[0]);
    //         if (repos.length == comts.length) {
    //           comts.sort(sorter);
    //           alert(comts[0].name);
    //         }
    //       } 
    //     );
    // });
}

var addGithub = function() {

  var mainScript = $(document.createElement("script"));
  mainScript.attr("src", "http://github.com/api/v1/json/lachlanhardy?callback=githubCallback");
  // mainScript.attr("src", "test/github.js");
  
  $("body").append(mainScript);
};

function githubCallback(json) {

  var commits = json.user.repositories;
	var username = "lachlanhardy";
	var repositories = "";
	var tests = "";
	var script = "";
	var mostRecent = "";
  
  $.each(commits, function(i,commit){
    repositories = commits[i];
    
    // if (repositories.private != true){
    if (repositories.private != false){ // debugging action, use above line for realz
      
      $.getJSON("http://github.com/api/v1/json/" + username + "/" + repositories.name + "/commits/master?callback=?",
        function(data){
          $.each(data.commits, function(i,commit){
            if (mostRecent < commit.committed_date){
              mostRecent = commit.committed_date;
            };      
          });
        } 
      );
    }
  });
}

var addGithub = function() {

  var mainScript = $(document.createElement("script"));
  // mainScript.attr("src", "http://github.com/api/v1/json/" + username + "?callback=githubCallback");
  mainScript.attr("src", "test/github.js");
  
  $("body").append(mainScript);
};

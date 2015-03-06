
var gitConverter= require("./GitTimeLapseNodeGit.js");
var Log = require("./Logger.js");
var StateAnalytics = require("./StateAnalytics");
var GitFilesToObjectsConverter = require("./GitFilesToObjectsConverter.js");

var LAProcessor = function(){

	function notifyRepoUpdate(repoPath, clientId){


	}

	function processFiles(files){
		return new Promise(function(resolve,reject){
			resolve(_getMetadataForFiles(files));
		});
	}

	function _getMetadataForFiles(files){

    //var commits = gitcommits.generatecommitsOfGitRepo("/srv/LAHelper/logs/597cd4dc32743cca14f26abc73dc994049018ea0");
    var Commits= gitConverter.getCommitsFromRepo("/srv/LAHelper/logs/8ec9722482776dafe71dc6b29c57616c5ad12279");
    //var Commits= gitConverter.getCommitsFromRepo("/srv/LAHelper/logs/78e6d96d44929f294d58d686dc07253416d748ec");
    Commits.then(function(commits){
        console.log(commits);
        GitFilesToObjectsConverter.convert(commits).then(function(states){
                StateAnalytics.getAnalyticsOfStates(states).then(function(states){

                    var returnedData = JSON.stringify(states);
                    res.send(returnedData);
                    log.debug("Success");
                    log.print();
                }, function(error){
                    console.log("Error: ", error);
                    res.send("Error: "+error);
                });

            }, function(error){
                console.log("Error: ", error);
                res.send("Error: "+error);
            }
        );

    }, function(error){
        res.send("Error : "+error);
        log.error("Error");
        log.print();
    });


	}

	return {
		notifyRepoUpdate: notifyRepoUpdate,
		processFiles: processFiles 
	};

};

module.exports = LAProcessor;

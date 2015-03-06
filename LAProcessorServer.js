"use strict";

var express = require("express");
var app = express();
var Processor = require("./Processor.js");
var gitConverter= require("./GitTimeLapseNodeGit.js");
var Log = require("./Logger.js");
var StateAnalytics = require("./StateAnalytics");
var GitFilesToObjectsConverter = require("./GitFilesToObjectsConverter.js");

var fs = require("fs");

app.post("/processFiles", function(req, res){

	var processor = new Processor();
} );

app.get("/client", function(req,res){

	var path = "/srv/LAHelper/logs/";
	fs.readdir(path,function(err,files){

		if(err){
			res.send("ERROR: "+err);
		}

		var clientList = files.filter(function(file){
			return fs.statSync(path+file).isDirectory();
		});
		res.send(clientList);
	})

});

app.get("/client/:nickname",function(req,res){
	var nickname = req.params.nickname;

});

app.get("/repoTimelapse/:clientId",function(req,res){
	//var commits = gitcommits.generatecommitsOfGitRepo("/srv/LAHelper/logs/597cd4dc32743cca14f26abc73dc994049018ea0");
	var clientId = req.params.clientId;
	console.log("Got request to server clientid: "+clientId);
	var Commits= gitConverter.getCommitsFromRepo("/srv/LAHelper/logs/"+clientId);
	//var Commits= gitConverter.getCommitsFromRepo("/srv/LAHelper/logs/78e6d96d44929f294d58d686dc07253416d748ec");
	Commits.then(function(commits){
		//console.log(commits);
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


});

var port = 50811;
app.listen(port, function(){
	console.log("LAProcessor server listening on port "+port);
});

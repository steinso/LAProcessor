"use strict";

var express = require("express");
var app = express();
var Processor = require("./Processor.js");
var gitConverter= require("./GitTimeLapseNodeGit.js");
var Log = require("./Logger.js");
var StateAnalytics = require("./StateAnalytics.js");
var GitFilesToObjectsConverter = require("./GitFilesToObjectsConverter.js");
var Promise = require("es6-promise").Promise;
var bodyParser = require("body-parser");


app.use(bodyParser.json({limit:"1000mb"}));

var fs = require("fs");

app.post("/processFiles", function(req, res){

	var processor = new Processor();
} );

app.get("/commitList/:clientId", function(req, res){

	var clientId = req.params.clientId;
	console.log("CommitLog request: " + clientId);
	gitConverter.getCommitListFromRepo("/srv/LAHelper/logs/" + clientId).then(function(commitList){

		var response = {status: "OK", commitList: commitList};
		res.send(JSON.stringify(response));

	}, function(error){
		var response = {status: "error", error: error };
		res.send(JSON.stringify(response));

	});
});

app.get("/repoTimelapse/:clientId", function(req, res){
	//var commits = gitcommits.generatecommitsOfGitRepo("/srv/LAHelper/logs/597cd4dc32743cca14f26abc73dc994049018ea0");
	var clientId = req.params.clientId;
	var log = new Log("Timelapse request for: " + clientId);
	var Commits = gitConverter.getCommitsFromRepo("/srv/LAHelper/logs/" + clientId);
	//var Commits= gitConverter.getCommitsFromRepo("/srv/LAHelper/logs/78e6d96d44929f294d58d686dc07253416d748ec");
	Commits.then(function(commits){
		//console.log(commits);
		GitFilesToObjectsConverter.convert(commits).then(function(states){
			StateAnalytics.getAnalyticsOfStates(states).then(function(states){

				var returnedData = JSON.stringify(states);
				res.send(returnedData);
				log.debug("Success: created analyzed timelapse");
				log.print();
			}, function(error){
				console.log("Error: ", error);
				log.print();
				res.send("Error: " + error);
			});

		}, function(error){
			console.log("Error: ", error);
			log.print();
			res.send("Error: " + error);
		});

	}, function(error){
		res.send("Error : " + error);
		log.error("Error");
		log.print();
	});


});

app.post('/process',function(req,res){
	 
	var clientId = req.params.clientId;
	var commits = req.body.commits;
	var log = new Log("unknown","Got process request: " + req.body.commits.length + " states");

		GitFilesToObjectsConverter.convert(commits).then(function(states){
			StateAnalytics.getAnalyticsOfStates(states).then(function(states){
				var returnedData = JSON.stringify(states);
				res.send(returnedData);
				log.debug("SUCCESS: States analyzed");
				log.print();
			}, function(error){
				console.log("Error: ", error);
				log.print();
				res.send("Error: " + error);
			});

		}, function(error){
			console.log("Error: ", error);
			log.print();
			res.send("Error: " + error);
		});
});

var port = 50811;
app.listen(port, function(){
	console.log("LAProcessor server listening on port "+port);
});

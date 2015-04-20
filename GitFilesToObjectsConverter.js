"use strict";
var type = require("typed");
var Promise = require("es6-promise").Promise;
/**
 * Converts commit objects to files object, that includes
 * storing relevant markers for each file inside the file object
 * instead of seperate files.
 *
 * Since markers are sometimes sent after the files, it 
 * ends up in the next commit, IF this happens, we retrieve it.
 *
 */

var GitFilesToObjectsConverter = function(){

	var filesMissingMarkers = 0;
	var markersRetrievedFromNext = 0;
	var filesMissingTests= 0;
	var testsRetrievedFromNext = 0;
	var statesContainingTestsFiles = 0;
	var testStore = new TestStore();

	var convert = function(commits){
		type.ofInput({"Array<Commit>":commits});


		// Extends the input object
		return new Promise(function(resolve, reject){
			try{
			var states = [];
			// Sort commits first
			commits = commits.sort(function(a, b){return b.time - a.time;});

			commits.map(function(commit, index){

				// Skip commits with no file changes
				if(commit.files.length === 0){
					console.log("Noe files.." + commit.sha);
					return;
				}

				var state = type.create("RepoState");
				state.files = [];
				state.time = commit.time;
				state.commitSha = commit.sha;
				state.commitMsg = commit.msg;
				states.push(state);

				var markersFiles = getFilesByNameRegex(commit.files, /\.markers\.json/);

				//No markers were found, check next commit
				if(markersFiles.length===0){
					var nextCommit = commits[index+1];
					if(nextCommit !== undefined){
						var timeDiff = nextCommit.time - commit.time;

						if(timeDiff <= 1900){
							markersRetrievedFromNext++;
							markersFiles =getFilesByNameRegex(nextCommit.files,/\.markers\.json/);
						}
					}
				}
				if(markersFiles.length === 0){
					filesMissingMarkers++;
				}

				_storeTestFiles(commit);

				var markers = new Markers(markersFiles);

				var relevantFiles = getRelevantFiles(commit.files);

				relevantFiles.map(function(_file){
					var file = type.create("StateFile");
					file.name = _file.name;
					file.fileContents = _file.fileContents;

					// Find markers and tests for file
					file.markers = markers.getMarkersForFile(_file);
					file.foundMarkers = true;
					file.foundTests = false;

					// If markers file was not changed in commit,
					// it must be the same as last time
					if(markersFiles.length === 0){
						file.foundMarkers = false;
					}

					state.files.push(file);
				});
			});

			// Ensure that markers are added to file state where
			// the markers file have not explicitly been edited
			var fileMarkers = {};
			states.map(function(state){
				state.files.map(function(file, index){
					if(!file.foundMarkers){
						if(fileMarkers[file.name] === undefined){
							file.markers = [];
						}else{
							file.markers = fileMarkers[file.name];
						}
					}

					fileMarkers[file.name] = file.markers;
				});
			});

			//Must reverse the array, as pushing makes last commit end up in front
			console.log("Got markers from next: ", markersRetrievedFromNext)
			console.log("States missong markers: ", filesMissingMarkers)

			console.log("Got tests from next: ", testsRetrievedFromNext)
			console.log("States missong tests: ", filesMissingTests)
			console.log("States containing tests: ",statesContainingTestsFiles);

			console.log("Applying tests");

			resolve({
				states: states,
				tests: testStore.getTests()
			});

			} catch(e){
				console.trace();
				console.error("Caught it ");
				reject(Error(e));
			}
		});
	};

	var _storeTestFiles = function(commit){

		var testsFiles = getFilesByNameRegex(commit.files, /\.tests\.json/);

		if(testsFiles.length > 0){
			statesContainingTestsFiles++;
			testsFiles.forEach(function(file){
				testStore.parseFile(file, commit.time);
			});
		} else {
			filesMissingTests++;
		}
	};

	var getRelevantFiles = function(files){
		type.ofInput({"Array<File>":files})
		return files.filter(function(file){if(file.name.match(/\.markers\.json/) == null && file.name.match(/\.tests\.json/) == null){return true;}});
	};	

	var getFilesByNameRegex = function(fileList,fileNameRegex){
		type.ofInput({"Array<File>": fileList, "RegExp": fileNameRegex});

		var files = fileList.filter(function(file){

			var match = file.name.match(fileNameRegex);
			if( match !== null){
				return match[0];
			}
		});
		return  files || [];
	};
	var getFileByName = function(files,fileName){
		type.ofInput({"Array<File>": files, "String": fileName});

		var file = files.filter(function(file){if(file.name === fileName){return file;}})[0];
		return  file || {};
	};

	return{
		convert: convert
	};
};




var Markers = function(markersFile){

	var markersPrFile = {};

	var _constructor = function(markersFiles){

		markersFiles.map(parseFiles);
	};

	var parseFiles= function(markersFile){

		try{
			if(markersFile.fileContents === undefined || markersFile.fileContents.length<1){return;}
			var markers = JSON.parse(markersFile.fileContents);

			if(markers === undefined || markers.listOfMarkers == undefined){return;}

			var files = Object.keys(markers.listOfMarkers);

			files.map(function(fileName){
				if(markersPrFile[fileName] === undefined){
					markersPrFile[fileName] = [];
				}
				var markerList = markers.listOfMarkers[fileName];
				//type.check("Array<FileMarker>", markerList);
				//Optional fields not supported in Typed yet
				//Extend current array with new markers array
				markersPrFile[fileName].push.apply(markersPrFile[fileName],markerList);
			});

		}catch(e){
			if(e instanceof TypeError){
				throw e;
			}
			console.log("Could not parse markers JSON");
		}
	};

	var getMarkersForFile = function(file){
		var name = "/"+file.name;
		//console.log("Getting markers for file:",name,Object.keys(markersPrFile));

		if(markersPrFile[name] !== undefined){
		//	console.log("Got markres");
			return markersPrFile[name];
		}
		return [];
	};

	_constructor(markersFile);

	return {
		getMarkersForFile: getMarkersForFile
	};
};

var TestStore = function(){

	var tests = [];

	var parseFile = function(testsFile, timeStamp){

		try{
			if(testsFile === undefined || testsFile.fileContents.length < 1){return;}
			var _tests = JSON.parse(testsFile.fileContents);
			_tests.forEach(function(test){
				type.check("FileTest", test);

				var stateTest = type.create("StateTest");

				stateTest.time = timeStamp;
				stateTest.methodName = test.methodName;
				stateTest.result = test.result;

				//Assume all test classes end in Test
				var seperatePackageAndClass = test.className.match(/^(\w+)\.(\w+)Test$/);
				if(seperatePackageAndClass === null){
					console.log("Not recognisable test:  "+test.className);
					return;
				}

				stateTest.packageName = seperatePackageAndClass[1];
				stateTest.contentName = seperatePackageAndClass[2];

				tests.push(stateTest);
			});
		}catch(e){
			if(e instanceof TypeError){
				throw e;
			}
			console.log("Could not parse test JSON", testsFile);
		}

	};

	return {
		parseFile: parseFile,
		getTests: function(){return tests;}
	};
};
module.exports = new GitFilesToObjectsConverter();

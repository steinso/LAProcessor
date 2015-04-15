"use strict";
var Promise = require("es6-promise").Promise;
var FileCategories = require("./FileCategories.js");
var type = require("typed");

var StateAnalytics = function(){
	var NOT_FOUND = "NotFound";

	var getAnalyticsOfStates= function(states){
		// Extends the input object
		return new Promise(function(resolve, reject){

			states.map(function(state){

				state.files = state.files.map(function(file){
					var analyticsFile = type.create("FileAnalytics");
					analyticsFile.name = file.name;
					analyticsFile.markers = file.markers; 
					analyticsFile.tests = file.tests;
					analyticsFile.foundTests = file.foundTests;
					analyticsFile.foundMarkers= file.foundMarkers;
					analyticsFile.numberOfLines = getLineCount(file);
					analyticsFile.numberOfMarkers = getMarkerCount(file);
					analyticsFile.numberOfFailedTests = getFailedTestsCount(file);
					analyticsFile.numberOfTests = getTotalTestsCount(file);
					analyticsFile.packageName = getPackageName(file);
					analyticsFile.type = getType(file);
					analyticsFile.contentName = getContentName(file);

					//Note: depends on already gathered information
					analyticsFile.categories = getCategoryRelations(analyticsFile);
					return analyticsFile;
				});

				state.files = state.files.filter(function(file){
					return _isValidFile(file);
				});
			});

			resolve(states);
		});
	};

	var _isValidFile = function(file){
		return file.numberOfLines >0;
	}

	var getLineCount = function(file){
		if(file !== undefined){
			return file.fileContents.split("\n").length - 1;
		}
	};

	var getMarkerCount = function(file){
		return file.markers.length;
	};

	var getFailedTestsCount = function(file){
		var failedTests = "?";
		if(file.tests !== undefined && file.tests.length !== undefined){

			failedTests = file.tests.reduce(function(p, c){
				if(c.result === "Failure" || c.result === "Error"){
					return p + 1;
				}
				return p;
			}, 0);
	}
		return failedTests;

	};

	var getTotalTestsCount = function(file){
		if(file.tests === undefined || file.tests.length === undefined){
			return "?";
		}
		return file.tests.length;
	};

	var getPackageName = function(file){
		var packageMatch = file.fileContents.match(/\s*package ([\w|\.]+);/);
		var packageName = NOT_FOUND;

		if(packageMatch !== null && packageMatch[1] !== null){
			packageName = packageMatch[1];
		}
		return packageName;
	};

	var getType = function(file){
		var classMatch = file.fileContents.match(/\s*public class (\w+)/);

		var interfaceMatch = file.fileContents.match(/\s*public interface (\w+)/);
		if(classMatch !== null){
			return "class";
		}

		if(interfaceMatch !== null){
			return "interface";
		}

		return NOT_FOUND; //Implement others on demand
	};

	var getContentName = function(file){

		var classMatch = file.fileContents.match(/\s*public (?:class|interface) (\w+)/);
		var className = NOT_FOUND;

		if(classMatch !== null && classMatch[1] !== null){
			className = classMatch[1];
		}
		return className;
	};

	var getCategoryRelations = function(file){
		var categories = FileCategories.getCategoriesForFile(file);
		return categories;
	};


	return {
		getLineCount: getLineCount,
		getAnalyticsOfStates: getAnalyticsOfStates
	};
};

module.exports = new StateAnalytics();

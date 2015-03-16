
var Promise = require("es6-promise").Promise;
var FileCategories = require("./FileCategories.js");

var StateAnalytics = function(){
	var NOT_FOUND = "NotFound";

	var getAnalyticsOfStates= function(states){
		// Extends the input object
		return new Promise(function(resolve, reject){



			states.map(function(state){

				state.files.map(function(file){
					file.numberOfLines = getLineCount(file);
					file.numberOfMarkers = getMarkerCount(file);
					file.numberOfFailedTests = getFailedTestsCount(file);
					file.numberOfTests = getTotalTestsCount(file);
					file.packageName = getPackageName(file);
					file.type = getType(file);
					file.contentName = getContentName(file);
					file.categories = getCategoryRelations(file);
				});
			});

			resolve(states);
		});
	};

	var getLineCount = function(file){
		if(file !== undefined){
			return file.fileContents.split("\n").length - 1;
		}
	};

	var getMarkerCount = function(file){
		return file.markers.length;
	};

	var getFailedTestsCount = function(file){
		return file.tests.reduce(function(p, c){if(c.result === "Failure"){return p + 1; }}, 0);

	};

	var getTotalTestsCount = function(file){
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

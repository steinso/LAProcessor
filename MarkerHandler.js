var problemCategories = require("./problemCategories.js");
var type = require("typed");
var MarkerHandler = function(markersFiles){

	var markersPrFile = {};

	var _constructor = function(markersFiles){

		markersFiles.map(parseFile);
	};

	/**
	 * Parses a .markers.json file which represents a hash map of files to markers.
	 *
	 * @param markersFile - File
	 * @return void;
	 */
	var parseFile = function(markersFile){

		try{
			var markersGivenFileName = _parseMarkerJson(markersFile);

			var files = Object.keys(markersGivenFileName.listOfMarkers);

			files.map(function(fileName){
				if(markersPrFile[fileName] === undefined){
					markersPrFile[fileName] = [];
				}

				var markerList = markersGivenFileName.listOfMarkers[fileName];
				markerList.forEach(_appendCategory);

				//type.check("Array<FileMarker>", markerList);
				//Optional fields not supported in Typed yet
				//Extend current array with new markers array
				markersPrFile[fileName].push.apply(markersPrFile[fileName], markerList);
			});

		}catch(e){
			if(e instanceof TypeError){
				throw e;
			}
			console.log("Could not parse markers JSON: " + e.message);
		}
	};

	var _parseMarkerJson = function(markersFile){
		if(markersFile.fileContents === undefined || markersFile.fileContents.length < 1){
			throw new Error("Empty file");
		}

		var markers = JSON.parse(markersFile.fileContents);

		if(markers === undefined || markers.listOfMarkers === undefined){
			throw new Error("No markers in file");
		}

		return markers;
	};

	/**
	 * @param file - StateFile
	 * @return Array<Marker>
	 */
	var getMarkersForFile = function(file){
		var name = "/" + file.name;

		if(markersPrFile[name] !== undefined){
			return markersPrFile[name];
		}
		return [];
	};

	//TODO: Add support for general categories?
	var _appendCategory = function(marker){
		var categoryId = marker.id;
		var categoryName = problemCategories.categoryIdToDescription[categoryId];

		if(categoryName !== undefined){
			marker.categoryName = categoryName;

		}else if(categoryId === undefined){
			marker.categoryName = "undefined";
		}else{
			marker.categoryName = "unknown";
			console.log("Unknown marker category: ", categoryId);
		}
	};

	_constructor(markersFiles);

	return {
		getMarkersForFile: getMarkersForFile,
		parseFile: parseFile
	};
};

module.exports = MarkerHandler;

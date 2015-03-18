"use strict";

/**
 * Note: To use this with different programming lanugages one option would be to
 * assign a prefix for the types of files.
 * Eg. java!interface instead of interface.
 *
 */
var manualCategories = [
	{
		name: "StockListener",
		type: "Observer-technique",
		package: "patterns.observable",
		files: {
			"interface": ["StockListener"],
			"class": ["SmartStock", "StockIndex", "Stock"]
		}
	},
	{
		name: "Rectangle",
		type: "Observer-technique",
		package: "stateandbehavior",
		files: {
			"class": ["Rectangle"]
		}
	}
];

var FileCategories = function(){

	var categories = [];
	var currentId = 0;

	manualCategories.forEach(function(category){
		addCategory(category);
	});

	function addCategory(category){
		//Give unique ID to each category
		category.id = currentId++;
		categories.push(category);
	}

	function getCategoriesForFile(file){
		var matchingCategories = [];

		categories.forEach(function(category){
			if(file.type === undefined){return; }
			if(category.files[file.type] !== undefined && category.files[file.type].indexOf(file.contentName) >= 0){
				matchingCategories.push(category);
			}
		});

		return matchingCategories;
	}

	return {
		getCategoriesForFile: getCategoriesForFile
	};
};


module.exports = new FileCategories();

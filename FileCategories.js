"use strict";

/**
 * Note: To use this with different programming lanugages one option would be to
 * assign a prefix for the types of files.
 * Eg. java!interface instead of interface.
 *
 */
var manualCategories = [

{
		name: "Account",
		type: "Tilstand og oppførsel",
		package: "stateandbehavior",
		files: {
			"class": ["Account"]
		}
	},{
		name: "Location",
		type: "Tilstand og oppførsel",
		package: "stateandbehavior",
		files: {
			"class": ["Location"]
		}
	},{
		name: "UpOrDownCounter",
		type: "Tilstand og oppførsel",
		package: "stateandbehavior",
		files: {
			"class": ["UpOrDownCounter"]
		}
	},{
		name: "Rectangle",
		type: "Tilstand og oppførsel",
		package: "stateandbehavior",
		files: {
			"class": ["Rectangle"]
		}
	},{
		name: "LineEditor",
		type: "Tilstand og oppførsel",
		package: "stateandbehavior",
		files: {
			"class": ["LineEditor"]
		}
		//NOTE: Gyldig Tilstand (oving2) Er ikke med her pga. det er umulig aa separere fra Oving1
	},{
		name: "Person",
		type: "Innkapsling",
		package: "encapsulation",
		files: {
			"class": ["Person"]
		}
	},{
		name: "Account",
		type: "Innkapsling",
		package: "encapsulation",
		files: {
			"class": ["Account"]
		}
	},{
		name: "Nim",
		type: "Innkapsling",
		package: "encapsulation",
		files: {
			"class": ["Nim"]
		}
	},{
		name: "RPN-Kalkulator",
		type: "Innkapsling",
		package: "encapsulation",
		files: {
			"class": ["RPNCalc"]
		}
	},{
		name: "TicTacToe",
		type: "Innkapsling",
		package: "encapsulation",
		files: {
			"class": ["TicTacToe"]
		}
	},{
		name: "BattleShip",
		type: "Innkapsling",
		package: "encapsulation",
		files: {
			"class": ["Battleship"] //Dette er en aapen oppgave
		}
	},{
		name: "Sudoku",
		type: "Innkapsling",
		package: "encapsulation",
		files: {
			"class": ["Sudoku"] // Dette er en aapoen oppgave
		}
	},{
		name: "Sokoban",
		type: "Innkapsling",
		package: "encapsulation",
		files: {
			"class": ["Sokoban"] // Dette er en aapoen oppgave
		}
	},{
		name: "Card",
		type: "Objektstrukturer",
		package: "objectstructures",
		files: {
			"class": ["Card","CardDeck","CardHand"]
		}
	},{
		name: "Partner",
		type: "Objektstrukturer",
		package: "objectstructures",
		files: {
			"class": ["Partner"]
		}
	},{
		name: "Twitter",
		type: "Objektstrukturer",
		package: "objectstructures",
		files: {
			"class": ["Tweet","TwitterAccount"]
		}
	},{
		name: "Person",
		type: "Objektstrukturer",
		package: "objectstructures",
		files: {
			"class": ["Person"]
		}
	},{
		name: "CardContainer",
		type: "Interface",
		package: "interfaces",
		files: {
			"interface": ["CardContainer"],
			"class": ["CardContainerIterator"]
		}
	},{
		name: "CardComparison",
		type: "Interface",
		package: "interfaces",
		files: {
			"interface": ["Comparable"],
			"class": ["Card","CardComparator"]
		}
	},{
		name: "Sortering av TwitterAccount",
		type: "Interface",
		package: "interfaces",
		files: {
			"class": ["TwitterAccount","UserNameComparator","FollowersCountComparator","TweetsCountComparator"]
		}
	},{
		name: "Named",
		type: "Interface",
		package: "interfaces",
		files: {
			"interface": ["Named"],
			"class": ["Person1","Person2","NamedComparator"]
		}
	},{
		name: "BinaryComputingIterator",
		type: "Interface",
		package: "interfaces",
		files: {
			"class": ["BinaryComputingIterator"]
		}
	},{
		name: "StringGrid",
		type: "Interface",
		package: "interfaces",
		files: {
			"interface": ["StringGrid"],
			"class": ["StringGridImpl","StringGridIterator"]
		}
	},{
		name: "Logger",
		type: "Delegering",
		package: "delegation",
		files: {
			"interface": ["ILogger"],
			"class": ["StreamLogger","FilteringLogger","DistributingLogger"]
		}
	},{
		name: "StockListener",
		type: "Observatør-teknikken",
		package: "patterns.patterns|patterns.observable",
		files: {
			"interface": ["StockListener"],
			"class": ["SmartStock", "StockIndex", "Stock"]
		}
	},{
		name: "HighscoreList",
		type: "Observatør-teknikken",
		package: "patterns.patterns|patterns.observable",
		files: {
			"interface": ["HighScoreListListener"],
			"class": ["HighScoreList","HighScoreListProgram"]
		}
	}
	/*
	 {
		name: "RPN Kalkulator",
		type: "Tilstand og oppførsel",
		package: "stateandbehavior",
		files: {
			"class": ["RPNCalc"]
		}
	},{
		name: "CardContainerImp",
		type: "Arv",
		package: "inheritance",
		files: {
			"class": ["CardContainerImpl","CardDeck","CardHand"]
		}
	},{
		name: "Digit",
		type: "Tilstand og oppførsel",
		package: "stateandbehavior",
		files: {
			"class": ["Digit"]
		}
	},{
		name: "Rectangle",
		type: "Observer-technique",
		package: "stateandbehavior",
		files: {
			"class": ["Rectangle"]
		}
	}
	*/
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
			if(category.files[file.type] !== undefined && category.files[file.type].indexOf(file.contentName) >= 0 && file.packageName.match(category.package) !== null){
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

var type = require("typed");

type.add("File", {
	name: "String",
	fileContents: "String"
});

type.add("Commit", {
	time: "Number",
	sha: "String",
	msg: "String",
	files: "Array<File>"
});

type.add("FileMarker",{
	id:"Number", 
	severity:"Number",
	sourceId:"String",
	arguments:"String",
	charStart:"Number",
	charEnd:"Number",
	categoryId: "Number",
	lineNumber: "Number",
	priority: "Number",
	userEditable: "Boolean",
	message: "String"
});

type.add("FileTest",{
	className: "String",
	methodName: "String",
	result: "String"
});

type.add("StateFile", {
	name: "String",
	fileContents: "String",
	markers: "Array<FileMarker>",
	tests: "Array<FileTest>",
	foundMarkers:"Boolean",
	foundTests:"Boolean"
});

type.add("RepoState", {
	time: "Number",
	commitSha: "String",
	commitMsg: "String",
	files: "Array<StateFile>"
});

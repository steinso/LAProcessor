var type = require("typed");

var TestHandler = function(){

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
			console.log("Could not parse test JSON", testsFile, e);
		}
	};

	return {
		parseFile: parseFile,
		getTests: function(){return tests;}
	};
};

module.exports = TestHandler;

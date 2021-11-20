// Main file for testing, will be run the other tests. Also includes options for testing.
process.env.NODE_ENV = 'test';

let fs = require('fs');
let chai = require('chai');
let supertest = require('supertest');
let app = require('../build/index.js');

global.app = app;
global.request = supertest(app);
global.expect = chai.expect;

global.apiVersion = "v1"; // Change this to another version if you want to test another api version.

let files = {};

// Loop through tests folder
fs.readdirSync("./tests").forEach(file => {
	if (file.substr(-3) === ".js" && file !== "test.js") { // Only js files and not test.js
		files[file.split("-")[0]] = require("./" + file);
	}
});

// Now that we have collected all the tests, run them.
Object.keys(files).sort(function(a, b) { 
	return a.localeCompare(b); // Sorting out by number 1 will go infront of 2
}).forEach(function(key) {
	files[key](); // Run the file using require.
});

var $ = require('mongous').Mongous, 
util = require('util');

var dbname = "h2r";
var terms = [
	{name: 'Apache', reading: "ə'pætʃi", from: "http://apache.com", otherReadings: ["'阿帕奇"]}, 
	{name: 'Maven', reading: "'meiven", from: "http://apache.com", otherReadings: ["马雯"]}
];

var things = [
{name: 'terms', value: terms}
];

for(var key in things){
	console.log("Begin to migrate " + dbname + "." + things[key].name + ", count: " + things[key].value.length);
	var objects = things[key].value;
	for(var i in objects){
		$(dbname + "." + things[key].name).save(objects[i]);	
	}
}

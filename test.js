var util = require('util');
var fs = require('fs');

var dir = "db/migration";
fs.readdir(dir, function(err, files){
	if(err){
		throw err;
	}
	for(var i in files){
		var file = files[i];
		console.log("Begin to migrate: " + file)
		fs.readFile(dir + '/' + file, function(err, data){
			if(err){
				throw err;
			}
			console.log("file:" + util.inspect(data));
		});
	};
});

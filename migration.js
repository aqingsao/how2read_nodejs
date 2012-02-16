var util = require('util')
, sqlite3 = require('sqlite3').verbose()
, config = require('./config')
,fs = require('fs');

var migration = function(){
	var pattern = /.*\/?(\d+)_*/;
	var env = process.env.NODE_ENV || "development";
	console.log("Currently we are in env " + env + " on " + config[env].db)
	var db = new sqlite3.Database(config[env].db, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, function(error){
		if(error){
			console.log("Could not open db " + config[env].db);
			throw error;
		}
		else{
			console.log("Database " + config[env].db + " is opened successfully.");
		}
	});

	function migrate(){
		var dir = arguments.length > 0 ? "db/migration/" + arguments[0] : "db/migration";
		_migrateDirectory(dir, function(a, b){return a.match(pattern)[1] - b.match(pattern)[1]});
	}

	function rollback(){
		var dir = arguments.length > 0 ? "db/rollback/" + arguments[0] : "db/rollback";
		_migrateDirectory(dir, function(a, b){return b.match(pattern)[1] - a.match(pattern)[1]});
	}

	function _migrateDirectory(dir, sortby){
		fs.stat(dir, function(err, stats){
			if(stats.isDirectory()){
				fs.readdir(dir, function(err, files){
					if(err){
						throw err;
					}
					files.sort(sortby);
					_migrateFiles(dir, files);
				});	
			}
			else if(stats.isFile()){
				_migrateFiles(null, [dir]);
			}
			else{
				throw "Illegal directory " + dir;
			}
		});
	}
	function _migrateFiles(dir, files){
		db.serialize(function(){
			for(var i in files){
				var file = dir ? dir + "/" + files[i] : files[i];
				var content = fs.readFileSync(file, "utf-8");
				console.log("Begin to migrate " + files[i] + ": " + content)
				db.run(content, function(err){
					if(err){
						throw err;
					}
				});
			}
		});
	}
	
	return {migrate: migrate, rollback: rollback};
}();

migration.rollback();

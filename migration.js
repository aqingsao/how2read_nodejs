var util = require('util')
, sqlite3 = require('sqlite3').verbose()
, config = require('./config')
,fs = require('fs')
,migration = require('./migration'); 

var migration = function(){
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
		db.serialize(function(){
			_migrateFiles("db/migration");
		});
	}

	function rollback(){
		db.serialize(function(){
			_migrateFiles("db/rollback");
		});
	}

	function _migrateFiles(dir){
		fs.stat(dir, function(err, stats){
			if(stats.isDirectory()){
				fs.readdir(dir, function(err, files){
					if(err){
						throw err;
					}
					var sortedFiles = _sort(files);
					for(var i in sortedFiles){
						_migrateFile(dir + "/" + sortedFiles[i]);
					};
				});	
			}
			else if(stats.isFile()){
				_migrateFile(dir);
			}
		});
	}
	function _migrateFile(file){
		console.log("Begin to migrate file: " + file)
		fs.readFile(file, "utf-8", function(err, data){
			if(err){
				throw err;
			}
			db.run(data, function(error){
				if(error){
					throw error;
				}
				else{
					console.log("migrate successfully.");
				}
			});
		});
	}
	function _sort(files){
		for(var i in files){
			files[i].
		}
	}
	
	return {migrate: migrate, rollback: rollback};
}();

migration.migrate();

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
			_migrateDirectory("db/migration", function(a, b){a.order - b.order});
		});
	}

	function rollback(){
		db.serialize(function(){
			_migrateDirectory("db/rollback", function(a, b){b.order - a.order});
		});
	}

	function _migrateDirectory(dir, sortby){
		fs.stat(dir, function(err, stats){
			if(stats.isDirectory()){
				fs.readdir(dir, function(err, files){
					if(err){
						throw err;
					}
					_migrateFiles(dir, files, sortby);
				});	
			}
			else if(stats.isFile()){
				_migrateFiles(null, [dir], sortby);
			}
			else{
				throw "Illegal file or directory " + dir;
			}
		});
	}
	function _migrateFiles(dir, files, sortby){
		var count = files.length;
		var fileContents = [];
		var pattern = /^(\d+)_*/;
		for(var i in files){
			var file = dir ? dir + "/" + files[i] : files[i];
			fs.readFile(file, "utf-8", function(err, data){
				if(err){
					throw err;
				}
				count--;
				fileContents.push({order: files[i].match(pattern)[1], content: data});
				console.log("Prepare to migrate " + file);
				if(count <= 0){
					fileContents.sort(sortby);
					for(var key in fileContents){
						console.log("Begin to migrate: " + fileContents[key].order)
						_runSql(fileContents[key].content);
					}					
				}
			});
		};
	}
	function _runSql(sql){
		db.run(sql, function(err){
			if(err){
				throw err;
			}
		});
	}
	
	return {migrate: migrate, rollback: rollback};
}();

migration.migrate();

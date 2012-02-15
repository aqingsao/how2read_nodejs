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
		fs.readdir(dir, function(err, files){
			if(err){
				throw err;
			}
			for(var i in files){
				var file = files[i];
				console.log("Begin to migrate file: " + file)
				fs.readFile(dir + '/' + file, "utf-8", function(err, data){
					if(err){
						throw err;
					}
					_runSql(data);
				});
			};
		});	
	}
	function _runSql(sql){
		db.run(sql, function(error){
			if(error){
				throw error;
			}
			else{
				console.log("migrate successfully.");
			}
		});
	}
	
	return {migrate: migrate, rollback: rollback};
}();

migration.rollback();

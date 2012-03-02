var util = require('util')
, sqlite3 = require('sqlite3').verbose()
, fs = require('fs');

var nodbdeploy_table = "nodeploydb";
var CREATE_SQL = "CREATE TABLE nodeploydb(id INTEGER, num INTEGER NOT NULL, fileName varchar(100) NOT NULL, created_at timestamp DEFAULT CURRENT_TIMESTAMP, updated_at timestamp DEFAULT CURRENT_TIMESTAMP, CONSTRAINT PK_TERMS_ID PRIMARY KEY(ID));";
var scriptPath = "";
var filePattern = /.*\/?(\d+)_*/;
var sqlPattern = /^\s*\w+/;
exports.migrate = function(dbname, dir, migrateTo){
	var db = typeof(dbname) == "string" ? _createdb(dbname) : dbname;
	_getLatestMigrated(db, function(latestScript){
		var filter = function(script){var num = script.match(filePattern)[1]; return num <= migrateTo && num > latestScript};
		var sortby = function(a, b){return a.match(filePattern)[1] - b.match(filePattern)[1]};
		var migrateDir = dir + "/migration/";
		_lookupScriptsInDirectory(migrateDir, function(files){
			files = files.filter(filter).sort(sortby);

			console.log("Of them, %s scripts are going to be migrated.", files.length);
			for(var i in files){
				console.log("Script %s", files[i]);
			}
			
			
			db.serialize(function(){
				for(var i in files){
					var num = files[i].match(filePattern)[1];
					var file = migrateDir + "/" + files[i];
					var content = fs.readFileSync(file, "utf-8");
					console.log("++Start to migrate " + files[i]);
					_runSqls(db, content, num, file, function(num, file){
						db.run("Insert into " + nodbdeploy_table + "(num, FileName) values(?, ?)", num, file, function(err){
							if(err){
								console.log("Failed to insert into nodbdeploy meta table for " + file + ": " + util.inspect(err));
								throw "Failed to insert in nodbdeploy meta table";
							}
						});
					});
				}
			});
		});			
	});
}

exports.rollback = function(dbname, dir ,rollbackTo){
	var db = typeof(dbname) == "string" ? _createdb(dbname) : dbname;
	_getLatestMigrated(db, function(latestScript){
		var filter = function(script){var num = script.match(filePattern)[1]; return num > rollbackTo && num <= latestScript};
		var sortby = function(a, b){return b.match(filePattern)[1] - a.match(filePattern)[1]};
		var rollbackDir = dir + "/rollback/";
		_lookupScriptsInDirectory(rollbackDir, function(files){
			files = files.filter(filter).sort(sortby);

			console.log("Of them, %s scripts are going to be rolled back.", files.length);
			for(var i in files){
				console.log("Script %s", files[i]);
			}

			db.serialize(function(){
				for(var i in files){
					var num = files[i].match(filePattern)[1];
					var file = rollbackDir + "/" + files[i];
					var content = fs.readFileSync(file, "utf-8");
					console.log("++Start to rollback " + files[i]);
					_runSqls(db, content, num, file, function(num, file){
						db.run("Delete from " + nodbdeploy_table + " where num = ? ", num, function(err){
							if(err){
								console.log("Failed to insert in nodbdeploy meta table for " + file + ": " + util.inspect(err));
								throw "Failed to insert in nodbdeploy meta table";
							}
						});
					});
				}
			});
		});			
	});
}

exports.createdb = _createdb;

function _createdb(dbname){
	return new sqlite3.Database(dbname, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, function(error){
		if(error){
			console.log("Could not open db " + dbname);
			throw error;
		}
		else{
			console.log("Database " + dbname + " is opened successfully.");
		}
	});
}
function _getLatestMigrated(dbname, callback){
	var db = typeof(dbname) == "string" ? _createdb(dbname) : dbname;
	db.get("select max(num) as num, fileName from " + nodbdeploy_table, function(err, row){
		if(err){
			if(err.message.indexOf("no such table") > 0){
				console.log("nodbdeploy meta table does not exist, will create %s.", nodbdeploy_table);
				db.run(CREATE_SQL, function(err){
					if(err){
						console.log("Error when create nodbdeploy meta table: %s", util.inspect(err));
						return;
					}
					callback(0);			
				});
			}
			else{
				console.log("Error when accessing db: %s" + util.inspect(err));
				return;				
			}
		}
		else{
			if(row.num){
			  	console.log("Latest script is " + row.num + ": " + row.fileName);
				callback(row.num);
			}
			else{
				callback(0);
			}
		}
	});
}
function _lookupScriptsInDirectory(dir, callback){
	fs.stat(dir, function(err, stats){
		if(err){
			throw err;
		}
		if(stats.isDirectory()){
			fs.readdir(dir, function(err, files){
				if(err){
					throw err;
				}
				console.log("Totally found %s scripts.", files.length);
				for(var i in files){
					console.log("Script %s", files[i]);
				}
				
				callback(files);
			});	
		}
		else{
			throw "Illegal directory " + dir;
		}
	});
}
function _runSqls(db, sqls, num, file, callback){
	sqls = sqls.split(";");
	db.serialize(function(){
		var count = 0;
		for(var i in sqls){
			var sql = sqls[i];
			if(sql.match(sqlPattern)){
				// console.log("--sql: " + sql);
				db.run(sql, function(err){
					if(err){
						throw err;
					}
				});
			}
			count ++;
			if(count >= sqls.length){
				callback(num, file);
			}
		}
	});
}

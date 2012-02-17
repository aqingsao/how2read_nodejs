var util = require('util')
, sqlite3 = require('sqlite3').verbose()
, config = require('./config')
, fs = require('fs');

var scriptPath = "";
var filePattern = /.*\/?(\d+)_*/;
var sqlPattern = /\w+/;
exports.migrate = function(dbname){
	var db = typeof(dbname) == "string" ? _createdb(dbname) : dbname;
	var dir = arguments.length > 1 ? "db/migration/" + arguments[1] : "db/migration";
	_migrateDirectory(db, dir, function(a, b){return a.match(filePattern)[1] - b.match(filePattern)[1]});
}

exports.rollback = function(dbname){
	var db = typeof(dbname) == "string" ? _createdb(dbname) : dbname;
	var dir = arguments.length > 1 ? "db/rollback/" + arguments[1] : "db/rollback";
	_migrateDirectory(db, dir, function(a, b){return b.match(filePattern)[1] - a.match(filePattern)[1]});
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
function _migrateDirectory(db, dir, sortby){
	fs.stat(dir, function(err, stats){
		if(err){
			throw err;
		}
		if(stats.isDirectory()){
			fs.readdir(dir, function(err, files){
				if(err){
					throw err;
				}
				files.sort(sortby);
				_migrateFiles(db, dir, files);
			});	
		}
		else if(stats.isFile()){
			_migrateFiles(db, null, [dir]);
		}
		else{
			throw "Illegal directory " + dir;
		}
	});
}
function _migrateFiles(db, dir, files){
	db.serialize(function(){
		for(var i in files){
			var file = dir ? dir + "/" + files[i] : files[i];
			var content = fs.readFileSync(file, "utf-8");
			console.log("Begin to migrate " + files[i]);
			_migrateFile(db, content);
		}
	});
}
function _migrateFile(db, sqls){
	sqls = sqls.split(";");
	for(var i in sqls){
		var sql = sqls[i];
		if(sql.match(sqlPattern)){
			console.log("sql: " + sql);
			db.run(sql, function(err){
				if(err){
					throw err;
				}
			});
		}
	}
}
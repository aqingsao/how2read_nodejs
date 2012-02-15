var util = require('util');
var sqlite3 = require('sqlite3').verbose();
var config = require('./config');

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
	var terms = "CREATE TABLE Terms(id INTEGER primary key, name varchar(50), reading varchar(50), source varchar(100), description TEXT)";

	db.serialize(function(){
		createTables(terms);
		
		migrateTerms();
	});
}

function rollback(){
	dropTables("Terms");
}

function createTables(){
	var tables  = arguments;
	for(var i in tables){
		db.run(tables[i], function(error){
			if(error){
				throw error;
			}
			else{
				console.log("Successfully created " + tables.length + " tables.");
			}
		});
	}
}

function dropTables(){
	var tables  = arguments;
	for(var i in tables){
		db.run("DROP TABLE " + tables[i], function(error){
			if(error){
				throw error;
			}
			{
				console.log("Successfully dropped table " + tables[i]);
			}
		});
	};
}

function migrateTerms(){
	var stmt = db.prepare("insert into Terms(name, reading, source, description) values(?, ?, ?, ?)");
	stmt.run('Apache', "ə'pætʃi", "http://apache.com", "A well known web server running on *nix operation system.");
	stmt.run('Maven', "'meiven", "http://maven.com", "A Java written build tool and dependency management tool.");
	stmt.finalize();
}

migrate();

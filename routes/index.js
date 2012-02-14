var util = require('util');
var sqlite3 = require('sqlite3').verbose();
var config = require('../config');

console.log("db: " + config.db)
var db = new sqlite3.Database(":memory:", sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, function(error){
	if(error){
		throw error;
	}
	else{
		console.log("Database is created successfully.");
	}
});
db.serialize(function(){
	db.run("CREATE TABLE Terms(id LONG, name TEXT, reading TEXT, source TEXT)", function(error){
		if(error){
			throw error;
		}
		else{
			console.log("Table terms is created.");
		}
	});
	var stmt = db.prepare("insert into Terms(name, reading, source) values(?, ?, ?)");
	stmt.run('Apache', "ə'pætʃi", "http://apache.com");
	stmt.run('Maven', "'meiven", "http://apache.com");
	stmt.finalize();
});

/*
 * GET home page.
 */

exports.index = function(req, res){	
	// var terms = [{name: 'Apache', reading: "ə'pætʃi", from: "http://apache.com"}, {name: 'Maven', reading: "'meiven", from: "http://apache.com"}];		
	db.all("SELECT * FROM Terms", function(err, rows) {
    	console.log(util.inspect(rows));
		res.render('index', { title: 'How to read me', terms: rows})
	});
};
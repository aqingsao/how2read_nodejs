var util = require('util');
var sqlite3 = require('sqlite3').verbose();
var config = require('../config');

var db = config[process.env.NODE_ENV || 'development'].db;
console.log("will use db: " + db)
var db = new sqlite3.Database(db, sqlite3.OPEN_READONLY, function(error){
	if(error){
		console.log("Cannot open database " + db);
		throw error;
	}
});

/*
 * GET home page.
 */

exports.index = function(req, res){	
	db.all("SELECT * FROM Terms", function(err, rows) {
    	console.log("Found " + rows.length + " terms.");
		res.render('index', { title: 'How to read me', terms: rows})
	});
};
var util = require('util');
var sqlite3 = require('sqlite3').verbose();
var config = require('../config');

/*
 * GET home page.
 */

exports.index = function(req, res){
	var db = process.h2r.db;
	db.all("SELECT * FROM Terms", function(err, rows) {
		if(err){
			throw err;
		}
    	console.log("Found terms: " + util.inspect(rows));
		res.render('index', { title: 'How to read me', terms: rows})
	});
};
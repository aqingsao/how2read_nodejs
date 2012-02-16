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

/*
 * POST term report right
 */
exports.term = function(req, res){	 
	var db = process.h2r.db;
	var isCorrect = Boolean(req.body.isCorrect);
	
	if(isCorrect) {
		db.run("UPDATE terms SET right_count = right_count + 1 WHERE id = ?", req.params.id, function(err){
			if(err){
				throw err;
			}
				
			res.send('我读对了，投票成功！');
		});
	} else{
		db.run("UPDATE terms SET wrong_count = wrong_count + 1 WHERE id = ?", req.params.id, function(err){
			if(err){
				throw err;
			}
				
			res.send('我读错了，投票成功！');
		});
	}
};

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
			console.log("Failed to query db: " + err);
			throw err;
		}
    	console.log("Found terms: " + util.inspect(rows));
		res.render('index', { title: 'How to read me', terms: rows})
	});
};

/*
 * POST report term pronunciation
 */
exports.term = function(req, res){
	var db = process.h2r.db;
	db.get("SELECT * FROM IPSTERMS WHERE ip = ? AND term = ?", _getClientIp(req), req.params.id, function(err, row) {
		if(err){
			console.log("Failed to query term: " + err);
			throw err;
		}
		 
		if(row){
			res.send("您的IP地址已经投过票了，请勿重复投票！", 403);
			return;
		}
		
		_updateTermCount(req, res, db);
	});
};
// GET term detail
exports.termDetail = function(req, res){
	var id = req.params.id;
	var db = process.h2r.db;
	db.get("SELECT * FROM Terms where id = ?", req.params.id, function(err, row){
		if(err){
			console.log("Failed to query term: " + err);
			throw err;
			throw err;
		}
			
		res.send(row);
	});	
};

function _updateTermCount(req, res, db){
	var termId = req.params.id;
	var sql = 'true' === req.body.isCorrect? "UPDATE terms SET right_count = right_count + 1 WHERE id = ?" : "UPDATE terms SET wrong_count = wrong_count + 1 WHERE id = ?";	
	db.run(sql, termId, function(err){
		if(err){
			throw err;
		}
		
		db.run("INSERT INTO IPSTERMS (ip, term) VALUES (?, ?)", _getClientIp(req), termId, function(err){
			if(err){
				throw err;
			}
			
			res.redirect('back');
		});
	});
}

function _getClientIp(req) {
	return req.header('x-forwarded-for') ? (forwardedIps.split(','))[0] : req.connection.remoteAddress;
};
var util = require('util');
var sqlite3 = require('sqlite3').verbose();
var config = require('../config');

/*
 * GET home page.
 */

exports.index = function(req, res){
	var db = process.h2r.db;
	db.all("SELECT * FROM Terms order by name", function(err, rows) {
		if(err){
			console.log("Failed to query db: " + err);
			throw err;
		}
		res.render('index', { title: 'How to read me', terms: rows})
	});
};

/*
 * POST report term pronunciation
 */
exports.term = function(req, res){
	var db = process.h2r.db;		
	var termId = req.params.id;
	var correct = 'true' === req.body.isCorrect;
	var sql = correct ? "UPDATE terms SET right_count = right_count + 1 WHERE id = ?" : "UPDATE terms SET wrong_count = wrong_count + 1 WHERE id = ?";	
	var ip = _getClientIp(req);
	
	if(_alreadyVoted(req.headers.cookie, termId)){
		console.log("Duplicate vote from " + ip + " for " + termId + ": " + correct);
		res.redirect('back');
		return;
	}
	console.log("Vote from " + ip + " for " + termId + ": " + correct);
	
	db.run(sql, termId, function(err){
		if(err){
			throw err;
		}
		
		db.run("INSERT INTO IPSTERMS (ip, term, result) VALUES (?, ?, ?)", ip, termId, correct ? 1 : 0, function(err){
			if(err){
				throw err;
			}
			
			var expireDate = new Date();
			expireDate.setFullYear(expireDate.getFullYear() + 1);
			res.cookie(termId, correct, {expires: expireDate, path: '/'});	
			res.redirect('back');
		});
	});
};

// GET term detail
exports.termDetail = function(req, res){
	var id = req.params.id;
	var db = process.h2r.db;
	db.get("SELECT * FROM Terms where id = ?", req.params.id, function(err, row){
		if(err){
			console.log("Failed to query term " + req.params.id + ": " + err);
			throw err;
		}
			
		res.send(row);
	});	
};

function _getClientIp(req) {	
	var forwardedIps = req.header('x-forwarded-for');
	return forwardedIps ? (forwardedIps.split(','))[0] : req.connection.remoteAddress;
};

function _alreadyVoted(cookies, termId){
	console.log("cookie: " + util.inspect(cookies));
	if(!cookies){
		return false;
	}
	var splittedCookies = cookies.split(";");
	for(var i in splittedCookies){
		var match = splittedCookies[i].match(/(\d+)=\w+/);
		if(match && match[1] == termId){
			return true;
		}
	}
	
	return false;
}
var util = require('util'), 
sqlite3 = require('sqlite3').verbose(), 
config = require('../config'), 
utils = require("../utils"),
Term = require('../model/term.js').Term, 
Reading = require('../model/reading.js').Reading;

var oneYear = 365 * 24 * 3600 * 1000, idPattern = /^\d+$/;
/*
 * GET home page.
 */
exports.index = function(req, res){
	var db = process.h2r.db;
	db.all("select t.id as tid, t.name as tname, t.source as tsource, t.description as tdesc, p.id as pid, p.symbol as psymbol, p.audio as paudio, p.count as pcount, p.is_correct as pcorrect from Readings p join Terms t on p.term = t.id order by t.name", function(err, rows) {
		if(err){
			console.log("Failed to query db: " + err);
			throw err;
		}
		
		var terms = _toTerms(rows);
		res.render('index', { title: 'How to Read Me', terms: terms, cookies: utils.toCookies(req.headers.cookie)})
	});
};

/*
 * POST report term pronunciation
 */
exports.reading = function(req, res){
	var db = process.h2r.db;		
	var termId = req.params.id;
	var readingId = req.params.rid;
	var ip = utils.getClientIp(req);
	var cookies = utils.toCookies(req.headers.cookie);
	
	if(!termId.match(idPattern) || !readingId.match(idPattern)){
		console.log("Invalid vote from " + ip + " for " + termId + ": " + readingId);
		res.send('Invalid vote', 412);
		return;
	}

	if(cookies.hasKey(termId)){
		console.log("Duplicate vote from user " + uid + " at " + ip + " for " + termId + ": " + readingId);
		res.send('Duplicate vote', 412);
		return;
	}
	
	db.serialize(function(){
		_obtainUidAndVote(db, cookies, termId, readingId, ip, res);	
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

// GET score 
exports.score = function(req, res){
	var db = process.h2r.db;		
	var cookies = utils.toCookies(req.headers.cookie);
	var ip = utils.getClientIp(req);
	
	if(!cookies.hasKey('uid')){
		console.log("No uid exists in cookies for " + ip);
		res.send('no uid exists', 412);
		return;
	}
	
	var uid = cookies.getValue('uid');
	db.all("select v.id, r.is_correct as correct from Votes v join Readings r on v.reading = r.id where v.userId=?", uid, function(err, rows) {
		if(err){
			console.log('view score failed: ' + util.inspect(err));
			res.send(err, 500);
			return;
		}
		
		var correct = 0;
		for(var i in rows){
			if(rows[i].correct == 'true'){
				correct ++;
			}
		}
		var voted = Math.max(rows.length, 8);
		var score = correct / voted;
		
		console.log('User ' + uid + ' score: ' + score);
		db.get("select count(*) as total from users", function(err, row){
			if(err){
				console.log('view score failed: ' + util.inspect(err));
				res.send(err, 500);
				return;
			}

			var total = Math.max(row.total, 1);
			db.get("select count(*) as higherThan from users where score <= ? ", score, function(err, row){
				if(err){
					console.log('view score failed: ' + util.inspect(err));
					res.send(err, 500);
					return;
				}
				var rate = row.higherThan / total;
				console.log('User ' + uid  + ' rate: ' + rate);
				res.json({voted: voted, correct: correct, score: rate});
			});
		});
	});
}

function _toTerms(rows){
	var terms = [];
	for(var i in rows){
		var term = _obtainTerm(terms, rows[i]);
		term.addReading(new Reading(rows[i]));
	}	
	return terms;
};

function _obtainTerm(terms, row){
	for(var i in terms){
		if(terms[i].id == row.tid){
			return terms[i];
		}
	}
	var term = new Term(row);
	terms.push(term);
	return term;
}

function _obtainUidAndVote(db, cookies, termId, readingId, ip, res){
	var uid = undefined;
	if(cookies.hasKey('uid')){
		uid = cookies.getValue('uid');
	}
	if(!uid){
		db.run("INSERT INTO Users (ip) VALUES (?)", ip, function(err){
			if(err){
				console.log('vote failed: ' + util.inspect(err));
				res.send(err, 500);
				return;
			}
			
			console.log("Create a new user " + this.lastID + " to vote.");
			res.cookie('uid', this.lastID, {maxAge: oneYear, path: '/'});
			_voting(db, termId, readingId, ip, this.lastID, res);
		});
	}
	else{
		console.log("User " + uid + " is to vote.");
		_voting(db, termId, readingId, ip, uid, res);
	}
}

function _voting(db, termId, readingId, ip, uid, res){
	db.get("select t.id as tid, t.name as tname, t.source as tsource, t.description as tdesc, p.id as pid, p.symbol as psymbol, p.audio as paudio, p.count as pcount, p.is_correct as pcorrect from Readings p join Terms t on p.term = t.id where p.id=?", readingId, function(err, row) {
		if(err){
			console.log('vote failed: ' + util.inspect(err));
			res.send(err, 412);
			return;
		}
		if(row.tid != termId){
			console.log('vote failed: reading does not belong to term');
			res.send('reading does not belong to term', 412);
			return;
		}
		db.run("UPDATE Readings SET count = count + 1 WHERE id = ?", readingId, function(err){
			if(err){
				console.log('vote failed: ' + util.inspect(err));
				res.send(err, 400);
				return;
			}

			db.run("INSERT INTO Votes (userId, term, reading) VALUES (?, ?, ?)", uid, termId, readingId, function(err){
				if(err){
					console.log('vote failed: ' + util.inspect(err));
					res.send(err, 500);
					return;
				}

				res.cookie(termId, readingId, {maxAge: oneYear, path: '/'});	
				db.all("select v.id, r.is_correct as correct from Votes v join Readings r on v.reading = r.id where v.userId=?", uid, function(err, rows) {
					if(err){
						console.log('vote failed: ' + util.inspect(err));
						res.send(err, 500);
						return;
					}

					var correct = 0;
					for(var i in rows){
						if(rows[i].correct == 'true'){
							correct ++;
						}
					}
					var voted = Math.max(rows.length, 8);
					var score = correct / voted;
					db.run("Update users set score = ? where id=?", score, uid, function(err) {
						if(err){
							console.log('vote failed: ' + util.inspect(err));
							res.send(err, 500);
							return;
						}

						db.all("select t.id as tid, t.name as tname, t.source as tsource, t.description as tdesc, p.id as pid, p.symbol as psymbol, p.audio as paudio, p.count as pcount, p.is_correct as pcorrect from Readings p join Terms t on p.term = t.id where t.id=?", termId, function(err, rows) {
							if(err){
								console.log('vote failed: ' + util.inspect(err));
								res.send(err, 500);
								return;
							}

							var terms = _toTerms(rows);
							res.json(terms[0]);
						});
					});
				});
			});
		});
	});
}

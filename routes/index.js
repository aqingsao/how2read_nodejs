var util = require('util'), 
sqlite3 = require('sqlite3').verbose(), 
config = require('../config'), 
utils = require("../utils"),
Term = require('../model/term.js').Term, 
Reading = require('../model/reading.js').Reading;

var oneYear = 365 * 24 * 3600 * 1000;
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
		res.render('index', { title: 'How to read me', terms: terms, cookies: utils.toCookies(req.headers.cookie)})
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

	if(utils.toCookies(req.headers.cookie).hasKey(termId)){
		console.log("Duplicate vote from " + ip + " for " + termId + ": " + readingId);
		res.send('Duplicate vote', 412);
		return;
	}
	console.log("Vote from " + ip + " for " + termId + ": " + readingId);

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

			db.run("INSERT INTO Votes (ip, term, reading) VALUES (?, ?, ?)", ip, termId, readingId, function(err){
				if(err){
					console.log('vote failed: ' + util.inspect(err));
					res.send(err, 500);
					return;
				}

				res.cookie(termId, readingId, {maxAge: oneYear, path: '/'});	
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

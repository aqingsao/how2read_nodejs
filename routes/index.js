var util = require('util');
var sqlite3 = require('sqlite3').verbose();
var config = require('../config'), utils = require("../utils");

var oneYear = 365 * 24 * 3600 * 1000;
/*
 * GET home page.
 */

exports.index = function(req, res){
	var db = process.h2r.db;
	db.all("select t.id as tid, t.name as tname, t.source as tsource, t.description as tdesc, p.id as pid, p.symbol as psymbol, p.audio as paudio, p.count as pcount, p.is_correct as pcorrect from PRONUNCIATIONS p join Terms t on p.term = t.id order by t.name", function(err, rows) {
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
	var ip = _getClientIp(req);
	
	if(utils.toCookies(req.headers.cookie).hasKey(termId)){
		console.log("Duplicate vote from " + ip + " for " + termId + ": " + correct);
		throw {duplicated: true};
	}
	console.log("Vote from " + ip + " for " + termId + ": " + readingId);
	
	db.run("UPDATE pronunciations SET count = count + 1 WHERE id = ?", readingId, function(err){
		if(err){
			console.log("Vote from " + ip + " for " + termId + " failed: " + util.inspect(err));
			throw err;
		}
		
		db.run("INSERT INTO IPSTERMS (ip, term, reading) VALUES (?, ?, ?)", ip, termId, readingId, function(err){
			if(err){
				throw err;
			}
			
			res.cookie(termId, readingId, {maxAge: oneYear, path: '/'});	
			db.all("select t.id as tid, t.name as tname, t.source as tsource, t.description as tdesc, p.id as pid, p.symbol as psymbol, p.audio as paudio, p.count as pcount, p.is_correct as pcorrect from PRONUNCIATIONS p join Terms t on p.term = t.id where t.id=?", termId, function(err, rows) {
				if(err){
					console.log("Failed to query db: " + err);
					throw err;
				}

				var terms = _toTerms(rows);
				res.json(terms[0]);
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
		var row = rows[i];
		var term = _obtainTerm(terms, row);
		term.readings.push({id:row.pid, symbol:row.psymbol, audio:row.paudio, count:row.pcount, correct:row.pcorrect});
		row.pcorrect == 'true'? term.right+=row.pcount : term.wrong+=row.pcount;
	}
	return terms;
}
function _getClientIp(req) {	
	var forwardedIps = req.header('x-forwarded-for');
	return forwardedIps ? (forwardedIps.split(','))[0] : req.connection.remoteAddress;
};

function _obtainTerm(terms, row){
	for(var i in terms){
		var term = terms[i];
		if(term.id == row.tid){
			return term;
		}
	}
	var term = {id: row.tid, name: row.tname, source: row.tsource, description: row.tdesc, wrong: 0, right: 0, readings: []};
	terms.push(term);
	return term;
}

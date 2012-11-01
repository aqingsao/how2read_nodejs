var util = require('util'), 
fs = require('fs'),
sqlite3 = require('sqlite3').verbose(), 
config = require('../config'), 
utils = require("../utils"),
Term = require('../model/term.js').Term, 
Reading = require('../model/reading.js').Reading ;

var oneYear = 365 * 24 * 3600 * 1000, idPattern = /^\d+$/;
/*
 * GET home page.
 */
exports.index = function(req, res){
	var db = process.h2r.db;
	db.all("select t.id as tid, t.name as tname, t.source as tsource, t.description as tdesc, p.id as pid, p.symbol as psymbol, p.audio as paudio, p.count as pcount, p.is_correct as pcorrect from Readings p join Terms t on p.term = t.id order by t.created_at desc", function(err, rows) {
		if(err){
			console.log("Failed to query db: " + err);
			throw err;
		}
		
		var terms = _toTerms(rows);
		res.render('index', { title: 'How to Pronounce', terms: terms, cookies: utils.toCookies(req.headers.cookie)})
	});
};
exports.term = function(req, res){
	var name = req.params.name;
	var db = process.h2r.db;
	db.all("select t.id as tid, t.name as tname, t.source as tsource, t.description as tdesc, p.id as pid, p.symbol as psymbol, p.audio as paudio, p.count as pcount, p.is_correct as pcorrect from Readings p join Terms t on p.term = t.id where t.name=? COLLATE NOCASE", name, function(err, rows) {
		if(err){
			console.log("Failed to query db: " + err);
			throw err;
		}
		
		if(rows.length <= 0){
			res.redirect("/");
		}
		else{
			var terms = _toTerms(rows)[0];
			res.render('term', { title: 'How to Pronounce ' + name, term: terms, cookies: utils.toCookies(req.headers.cookie)});
		}
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
		var voted = rows.length;
		var score = correct / Math.max(rows.length, 1);
		
		if(score <= 0.0){
			res.json({voted: voted, correct: correct, rate: 0});
		}
		else if(score >= 1.0){
			res.json({voted: voted, correct: correct, rate: 1});			
		}
		else{
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
					console.log('User ' + uid  + ' won ' + row.higherThan + " of total " + total);
					res.json({voted: voted, correct: correct, rate: rate});
				});
			});	
		}
	});
};
exports.adminLoginPage = function(req, res){
	res.render('admin/login', {layout:'admin/layout.jade', title: 'How to Pronounce Admin Page'})
};

exports.adminLogin = function(req, res, env){
	var name = req.body.name;
	var passwd = req.body.passwd;
	var passwords = require(config[env].passwd);
	if(passwords[name] == passwd){
		req.session.loggedIn = true;
		res.redirect('/admin/term')
	}
	else{
		console.log("Invalid user name " + name +" and password "+ passwd);
		res.redirect("/");
	}
};
exports.adminTerm = function(req, res){
	if(req.session.loggedIn != true){
		console.log("You are not logged in yet.");
		res.redirect("/");
		return;
	}
	res.render('admin/term', {layout:'admin/layout.jade', title: 'Add new term'})
};
exports.adminAddTerm = function(req, res){
	if(req.session.loggedIn != true){
		console.log("You are not logged in yet.");
		res.redirect("/");
		return;
	}
	var db = process.h2r.db;	
	
	try{
		if(req.body.symbols.constructor != Array){
			throw 'Should have least 2 readings for term ' + req.body.name;
		}
		if(req.body.symbols.length * 2 != req.files.audios.length){
			throw 'there are ' + req.body.symbols.length + ' readings but ' + req.files.audios.length +' files are uploaded.';
		}
		var correctReadingsCount = 0;
		console.log(req.body.isCorrects);
		for(var i in req.body.isCorrects){
			if(req.body.isCorrects[i] == 'true'){
				correctReadingsCount++;
			}
		}
		if(correctReadingsCount != 1){
			throw 'there should be only 1 but actually ' + correctReadingsCount + ' readings that are correct.';
		}

		var name = req.body.name;
		var source = req.body.source;
		var description = req.body.description;
		var dir = __dirname + '/../public/audio/';
		if(!fs.existsSync(dir)){
			throw "Audio directory " + dir +" does not exist.";
		}
		for(var i in req.files.audios){
			var audio = req.files.audios[i];
			var newPath = dir + audio.name;

      		console.log("Rename file " + audio.path +" to " + newPath);
    		fs.rename(audio.path, newPath, function(err) {
    			if(err){
    				throw err;
    			}
      			fs.exists(newPath, function(exists){
      				if(!exists){
      					throw "File "+ newPath +" does not exsit";
      				}
      			});
    		});
  		}

		db.all("select name from Terms where name=? COLLATE NOCASE", name, function(err, rows) {
			if(rows.length > 0){
				throw 'Term ' + name +" already exists."
			}

			console.log("Adding new term with " + name +", source " + source);
			db.serialize(function() {
				db.run("insert into Terms(name, source, description) values(?, ?, ?)", [name, source, description]);
  				var stmt = db.prepare("insert into readings(symbol, audio, is_correct, term) values(?, ?, ?, (select id from terms where name=?))");
				for(var i in req.body.symbols){
					var symbol = req.body.symbols[i];
					var isCorrect = req.body.isCorrects[i];
					var audio = req.files.audios[i * 2];
					var audioName = audio.name.split(".")[0];
					console.log("symbol: " + symbol +", isCorrect: " + isCorrect +", audio: " + audioName);
      				stmt.run(symbol, audioName, isCorrect, name);
  				}
  				stmt.finalize();
  			});
			res.render("admin/term", {layout: 'admin/layout.jade', title:'Add new term', splash: 'Term ' + name +" has been added successfully."});
		});
	} catch(e){
		console.log("failed to add term: ");
		console.log(e);
		res.render("admin/term", {layout: 'admin/layout.jade', title:'Add new term', splash: 'Failed to add ' + req.body.name +": " + e});
	}
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
	

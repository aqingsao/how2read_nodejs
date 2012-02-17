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
 * POST term report pronunciation
 */
exports.term = function(req, res){
	var sql = 'true' === req.body.isCorrect? "UPDATE terms SET right_count = right_count + 1 WHERE id = ?" : "UPDATE terms SET wrong_count = wrong_count + 1 WHERE id = ?";
	var db = process.h2r.db;
	db.run(sql, req.params.id, function(err){
		if(err){
			throw err;
		}
			
		res.redirect('back');
	});	
};

function _getClientIp(req) {
  var ipAddress;
  
  var forwardedIps = req.header('x-forwarded-for'); 
  if (forwardedIps) {
    var forwardedIps = forwardedIps.split(',');
    ipAddress = forwardedIps[0];
  }

  if (!ipAddress) {  
    ipAddress = req.connection.remoteAddress;
  }

  return ipAddress;
};
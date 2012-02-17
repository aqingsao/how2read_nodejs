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
	if('true' === req.body.isCorrect) {
		_updatePronunciationCount("UPDATE terms SET right_count = right_count + 1 WHERE id = ?", "我读对了，投票成功！", req, res);
	} 
	else{
		_updatePronunciationCount("UPDATE terms SET wrong_count = wrong_count + 1 WHERE id = ?", "我读错了，投票成功！", req, res);	
	}		
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

function _updatePronunciationCount(sql, resbody, req, res){
	var db = process.h2r.db;
	db.run(sql, req.params.id, function(err){
		if(err){
			throw err;
		}
			
		res.redirect('back');
	});
}

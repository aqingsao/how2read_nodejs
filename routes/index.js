var $ = require('mongous').Mongous;
var util = require('util');

/*
 * GET home page.
 */

exports.index = function(req, res){	
	$("h2r.terms").find(function(reply){
		console.log("Terms: " + util.inspect(reply.documents));
		res.render('index', { title: 'How to read me', terms: reply.documents})
	});
};
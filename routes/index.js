var util = require('util');

/*
 * GET home page.
 */

exports.index = function(req, res){	
	var terms = [{name: 'Apache', reading: "ə'pætʃi", from: "http://apache.com"}, {name: 'Maven', reading: "'meiven", from: "http://apache.com"}];
	res.render('index', { title: 'How to read me', terms: terms})
};
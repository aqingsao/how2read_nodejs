var config = require('../config'),
util = require('util'),
fs = require('fs');

var env = process.env.node_env || 'production';
var now = new Date();
var src = config[env].db;
var dst = util.format("/home/ec2-user/backup/h2r.sqlite.%d%s%s_%s%s", now.getFullYear(), _format(now.getMonth() + 1), _format(now.getDate()), _format(now.getHours()), _format(now.getMinutes()));

console.log("Backup db files from " + src + " to " + dst);


fs.stat(src, function(err, stats){
	if (err) {
      	console.log("Source file " + src + " exists.");
		return;
    }
    
	var is = fs.createReadStream(src);
    var os = fs.createWriteStream(dst);
    util.pump(is, os, function(err){
		if(err){
			console.log("Failed to backup: " + util.inspect(err));
			return;
		}
		
		console.log("Backup finished.");
	});
});

function _format(num){
	if(num < 10){
		return '0' + num;
	}
	return num;
}

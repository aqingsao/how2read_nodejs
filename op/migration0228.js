var migration = require('../db/migration'), 
config = require('../config'), 
util = require('util'),
program = require('commander');

var from = '/home/ec2-user/db/old.sqlite';
var to = '/home/ec2-user/db/h2r.sqlite';
console.log('Will migrate db from ' + from + ' to ' + to);
var dbFrom = migration.createdb(from);
var dbTo = migration.createdb(to);

dbFrom.all("select count, symbol from Readings", function(err, rows){
	if(err){
		console.log("Migrate readings failed: " + util.inspect(err));
		return;
	}
	
	var count = 0;
	for(var i in rows){
		dbTo.run("Update Readings set count = ? where symbol = ?", rows[i].count, rows[i].symbol, function(err){
			if(err){
				console.log("Migrate readings failed: " + err);
				return;
			}
			count ++;
			if(count >= rows.length){
				console.log("Migrate Reading finished.");
			}
		});
	}
});

dbTo.run("Insert into Users(ip, score) values(?, ?)", '127.0.0.1', 1.0, function(err){
	if(err){
		console.log("Insert user failed: " + err);
		return;
	}
	
	var uid = this.lastID;
	dbFrom.all("select * from Votes", function(err, rows){
		if(err){
			console.log("Migrate votes failed: " + util.inspect(err));
			return;
		}

		var count = 0;
		for(var i in rows){
			var symbol = rows[i].symbol;
			var count = rows[i].count;
			dbTo.run("Insert into Votes(userId, term, reading, created_at, updated_at) values(?, ?, ?, ?, ?)", uid, rows[i].term, rows[i].reading, rows[i].created_at, rows[i].updated_at, function(err){
				if(err){
					console.log("Migrate votes failed: " + err);
					return;
				}
				count ++;
				if(count >= rows.length){
					console.log("Migrate votes finished.");
				}
			});
		}
	});
});

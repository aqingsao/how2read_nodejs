var migration = require('./db/migration'), 
config = require('./config'), 
util = require('util'),
program = require('commander');

program.version('0.0.1')
.option('-r, --rollbackTo [number]', '[optional] Rollback scripts to [number], excluded, default to all', parseInt)
.option('-m, --migrateTo [number]', '[optional] Migrate scripts to [number], included, default to newest', parseInt)
.option('-e, --env [env]', '[optional] default env is development', 'development')
.option('-d, --directory <dir>', "If set to <dir>, then look up migration scripts in <dir>/migration, and lookup rollback scripts in <dir>/rollback, default to 'db'", 'db')
.parse(process.argv);

var env = program.env;
var dir = config[env].script;

if(!program.rollbackTo && !program.migrateTo){
  console.log("Usage: node migration <-r [number] | -m [number]> [-e [env]] -h");
  return;
}

console.log("nodbdeploy runs on env %s, will use %s as base directory. ",env,  program.directory);

var db = migration.createdb(config[env].db);
if(program.rollbackTo){
	if(program.rollbackTo == true){
		console.log("Will rollback all scripts.");
	  	migration.rollback(db, program.directory, 0);   
	}
	else{
	  	console.log("Will rollback scripts to " + program.migrateTo);
	  	migration.rollback(db, program.directory, program.rollbackTo);   
	}
}
if(program.migrateTo){
	if(program.migrateTo == true){
		console.log("Will migrate scripts to newest.");
		migration.migrate(db, program.directory, 999);
	}
	else{
	  	console.log("Will migrate scripts to " + program.migrateTo);
	  	migration.migrate(db, program.directory, program.migrateTo);
	}
}

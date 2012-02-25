var migration = require('./db/migration'), 
config = require('./config'), 
util = require('util'),
program = require('commander');

program.version('0.0.1')
.option('-r, --rollback', 'Rollback scripts')
.option('-m, --migrate', 'Migrate scripts')
.option('-e, --env <env>', '[optional] default env is development', 'development')
.parse(process.argv);

var env = program.env;
var dir = config[env].script;

if(!program.rollback && !program.migrate){
  console.log("Usage: node migration -r -m [-e env] -h");
  return;
}

var db = migration.createdb(config[env].db);
if(program.rollback){
  console.log("Start to rollback scripts on env " + env);
  migration.rollback(db, dir);   
}
if(program.migrate){
  console.log("Start to migrate scripts on env " + env);
  migration.migrate(db, dir);
}

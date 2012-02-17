var migration = require('../migration'), 
config = require('../config'), 
util = require('util');

var env = process.env.NODE_ENV || 'development';
console.log("Start to migrate db " + config[env].db + " on " + env + " env.");

var db = migration.createdb(config[env].db);
// migration.rollback(db, dir);
migration.migrate(db, config[env].script + "/migration");

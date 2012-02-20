var migration = require('../migration');
var config = require('../config');

var env = 'production';
var dbname = config[env].db;
var dir = config[env].script;
migration.migrate(dbname, dir);
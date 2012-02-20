var migration = require('../migration');

var dbname = config['production'].db;
var dir = "/home/ec2-user/how2read/db";
migration.migrate(dbname, dir);
var migration = require('./migration')
  , config = require('./config');

var dbname = config['production'].db;
var dir = "/home/ec2-user/how2read/db";
migration.migrate(dbname, dir);
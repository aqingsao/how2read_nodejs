
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , util = require('util')
  , reloader = require('reloader')
  , migration = require('./migration')
  , config = require('./config');

var app = module.exports = express.createServer();

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// prepare data for dev env
process.h2r = {db: migration.createdb(config[app.settings.env].db)};
if('development' == app.settings.env){
  console.log("Start to migrate db " + config[app.settings.env].db + " on " + app.settings.env + " env.");
  migration.rollback(process.h2r.db, "db");
  migration.migrate(process.h2r.db, "db");
}

// Routes
app.get('/', routes.index);
app.post('/term/:id', routes.term);
app.get('/term/:id', routes.termDetail);

var port = process.env.PORT || 3000;
app.listen(port);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

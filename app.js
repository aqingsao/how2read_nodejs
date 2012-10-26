
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , util = require('util')
  , reloader = require('reloader')
  , migration = require('./db/migration')
  , config = require('./config');

var app = module.exports = express.createServer();

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'how2read.me' }));
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

// Routes
app.get('/', routes.index);
app.post('/term/:id/reading/:rid', routes.reading);
app.get('/term/:name', routes.term);
app.get('/score', routes.score);
app.get('/admin/login', routes.adminLoginPage);
app.post('/admin/login', function(req, res){
  routes.adminLogin(req, res, app.settings.env);
});
app.get('/admin/term', routes.adminTerm);
app.post('/admin/term', routes.adminAddTerm);

var port = process.env.PORT || 3000;
app.listen(port);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

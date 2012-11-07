
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , util = require('util')
  , reloader = require('reloader')
  , migration = require('./db/migration')
  , config = require('./config')
  , argv = require('optimist').default({p:8080}).argv

var app = module.exports = express.createServer();

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'how2read.me' }));
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/public'));
  app.use(app.router);
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
app.get('*', function(req, res){
res.render('404', {  
        status: 404,  
        title: '程序员最容易读错的单词',  
        layout:'layout.jade'
    }); });

app.listen(argv.p);
console.log("Express server listening on port %d in %s mode", argv.p, app.settings.env);

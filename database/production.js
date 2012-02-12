var Sequelize = require("sequelize");
var sequelize = new Sequelize('h2r', 'h2r', 'H0w@read', {
	dialect: 'sqlite', 
	storage: 'data/h2r.sqlite', 
	define: {timestamp: true, charset: 'utf8'}, 
	logging: true
}); 

var Terms = sequelize.define('Terms', {
  name: {type: Sequelize.STRING, unique: true}, 
  reading: {type: Sequelize.STRING, allowNull: false}, 
  from: {type: Sequelize.STRING, allowNull: false}, 
  description: Sequelize.TEXT, 
});
var apache = Terms.build({name: 'Apache', reading: "ə'pætʃi", from: "http://apache.com"})
var maven = Terms.build({name: 'Maven', reading: "'meiven", from: "http://apache.com"});
var terms = [apache, maven];

sequelize.sync().success(function(){
	console.log("Create table Terms");
	for(var key in terms){
		var term = terms[key];
		term.save().success(function(){
			console.log("insert " + term);
		}).error(function(err){
			throw err;
		});
	}
}).error(function(error){
	throw error;
});


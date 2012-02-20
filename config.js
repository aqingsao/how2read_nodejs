var config = {};
config.production = {
	db: '/home/ec2-user/h2r/db/h2r.sqlite', 
	script:'/home/ec2-user/how2read/db'
};
config.development = {
	db: '../h2r.sqlite', 
	script: 'db'
};
module.exports = config;

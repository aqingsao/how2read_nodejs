var config = {};
config.production = {
	db: '/home/ec2-user/db/h2r.sqlite', 
	script:'/home/ec2-user/how2read/db',
	passwd: '/home/ec2-user/passwd.js'
};
config.development = {
	db: '../h2r.sqlite', 
	script: 'db',
	passwd: '../passwd.js'
};
module.exports = config;

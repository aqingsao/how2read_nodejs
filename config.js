var config = {};
config.production = {
	db: '../h2r.sqlite'
};
config.development = {
	db: ':memory:'
};
module.exports = config;

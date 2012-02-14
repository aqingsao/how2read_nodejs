var config = {};
config.production = {
	db: '../data/h2r.sqlite'
};
config.development = {
	db: ':memory:'
};
module.exports = config;

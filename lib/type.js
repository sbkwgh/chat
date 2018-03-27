let { Sequelize } = require('../models');
let validationError = require('./validationError');

module.exports = {
	type (type, val) {
		if(typeof val !== type) {
			throw validationError(Sequelize, {
				message: 'Parameter must be of type ' + type,
				value: val
			});
		} else {
			return val;
		}
	},
	number (val) {
		return this.type('number', val);
	},
	string (val) {
		return this.type('string', val);
	},
	boolean (val) {
		return this.type('boolean', val);
	},
};
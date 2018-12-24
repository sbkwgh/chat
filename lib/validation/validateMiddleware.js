let TypeValidationError = require('../errors/typeValidationError');
let validator = require('./validator');

module.exports = function (schema) {
	return function (req, res, next) {
		let errors = [];

		for(let key in schema) {
			errors.push(
				...validator(req[key], schema[key])
			);
		}

		if(errors.length) {
			res.status(400);
			res.json(new TypeValidationError(errors));
		} else {
			next();
		}
	};
};

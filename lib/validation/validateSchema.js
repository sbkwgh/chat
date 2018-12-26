const TypeValidationError = require('../errors/typeValidationError');
const validator = require('./validator');

module.exports = function (schema, obj) {
	let errors = validator(obj, schema)

	if(errors.length) throw new TypeValidationError(errors);
};
module.exports = function (schema) {
	class TypeValidationError extends Error {
		constructor (errors) {
			super('The request failed type validations');

			this.name = 'TypeValidationError';
			this.errors = errors;
		}
	}

	function typeChecker (val, type) {
		let types = type.split('.');

		if(type === 'integer') {
			return Number.isSafeInteger(val);
		} else if(types.length === 2 && types[0] === 'array') {
			return (
				Array.isArray(val) &&
				val.filter(v => typeChecker(v, types[1])).length === val.length
			);
		} else if (type === 'string(integer)') {
			return (
				typeof val === 'string' &&
				/^\d+$/.test(val)
			);
		} else {
			return typeof val === type;
		}
	}

	function validator (obj, props) {
		let errors = [];

		for(let prop in props) {
			let objVal = obj[prop];
			let propVals = props[prop];

			//If it is undefined but required
			if (objVal === undefined && !propVals.required) {
				continue;
			//If there is a function to test it
			} else if (
				typeof propVals.type === 'function' &&
				!propVals.type(objVal)
			) {
				errors.push({
					path: prop,
					message: prop + ' must be of type ' + propVals.typeName
				});
			//If there the type name is a string
			} else if (
				typeof propVals.type === 'string' &&
				!typeChecker(objVal, propVals.type)
			) {
				errors.push({
					path: prop,
					message: prop + ' must be of type ' + propVals.type
				});
			}
		}

		return errors;
	}

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
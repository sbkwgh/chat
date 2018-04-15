module.exports = function (schema) {
	class TypeValidationError extends Error {
		constructor (errors) {
			super('The request failed type validations');

			this.name = 'TypeValidationError';
			this.errors = errors;
		}
	}

	function validator (obj, props) {
		let errors = [];

		for(let prop in props) {
			let objVal = obj[prop];
			let propVals = props[prop];

			//If it is the wrong type
			//Of it is undefined but required
			if (objVal === undefined && !propVals.required) {
				continue;
			} else if (
				typeof propVals.type === 'function' &&
				!propVals.type(objVal)
			) {
				errors.push({
					path: prop,
					message: prop + ' must be of type ' + propVals.typeName
				});
			} else if (
				typeof propVals.type === 'string' &&
				typeof objVal !== propVals.type
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
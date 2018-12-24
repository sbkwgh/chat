module.exports = class TypeValidationError extends Error {
	constructor (errors) {
		super('The request failed type validations');

		this.name = 'TypeValidationError';
		this.errors = errors;

	}
};
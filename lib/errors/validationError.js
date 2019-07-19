let Sequelize = require('sequelize');

module.exports = function (error) {
	return new Sequelize.ValidationError(error.message, [
		new Sequelize.ValidationErrorItem(
			error.message,
			'Validation error',
			error.path,
			error.value
		)
	]);
}
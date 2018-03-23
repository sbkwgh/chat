module.exports = function (sequelize, error) {
	return new sequelize.ValidationError(error.message, [
		new sequelize.ValidationErrorItem(
			error.message,
			'Validation error',
			error.path,
			error.value
		)
	]);
}
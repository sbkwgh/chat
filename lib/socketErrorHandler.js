const TypeValidationError = require('./errors/typeValidationError');
const { sequelize } = require('../models');

module.exports = function (err, socket) {
	if(err instanceof sequelize.ValidationError || err instanceof TypeValidationError) {
		socket.emit('errors', {
			status: 400,
			...err
		});
	} else if (err.message === 'unauthorized') {
		socket.emit('errors', {
			status: 401,
			errors: [{ message: 'Request not authorized' }]
		});
	} else {
		console.log(err);
		socket.emit('errors', {
			status: 500,
			errors: [{ message: 'There was an unknown error on our side - please try again later' }]
		});
	}
};
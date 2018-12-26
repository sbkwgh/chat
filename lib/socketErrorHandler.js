module.exports = function (err, socket) {
	if(err instanceof sequelize.ValidationError) {
		socket.emit('error', {
			status: 400,
			...err
		});
	} else if (err.message === 'unauthorized') {
		socket.emit('error', {
			status: 401,
			errors: [{ message: 'Request not authorized' }]
		});
	} else {
		console.log(err);
		socket.emit('error', {
			status: 500,
			errors: [{ message: 'There was an unknown error on our side - please try again later' }]
		});
	}
};
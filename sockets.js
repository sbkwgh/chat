const io = require('socket.io');

module.exports = function ({ server, app, sessionMiddleware }) {
	app.set('io', io(server));

	//Associate express session with socket session
	app.get('io').use((socket, next) => {
		sessionMiddleware(socket.request, socket.request.res, next);
	});

	app.get('io').on('connection', socket => {
		socket.on('message', data => require('./socket_routes')(data, socket));
	});
};
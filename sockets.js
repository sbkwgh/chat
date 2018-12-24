const io = require('socket.io');

module.exports = function ({ server, app, sessionMiddleware }) {
	app.set('io', io(server));
	app.set('io-users', {});

	function addIoUser (socket) {
		let ioUsers = app.get('io-users');
		ioUsers[socket.request.session.userId] = socket.id;

		app.set('io-users', ioUsers)
	}
	function removeIoUser (socket) {
		let ioUsers = app.get('io-users');
		delete ioUsers[socket.request.session.userId];

		app.set('io-users', ioUsers)
	}

	//Associate express session with socket session
	app.get('io').use((socket, next) => {
		sessionMiddleware(socket.request, socket.request.res, next);
	});

	app.get('io').on('connection', socket => {
		if(socket.request.session.authenticated) {
			addIoUser(socket);
			socket.on('disconnect', () => { removeIoUser(socket); });
		}

	});
};
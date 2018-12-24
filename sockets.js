const io = require('socket.io');

module.exports = function ({ server, app, sessionMiddleware }) {
	app.set('io', io(server));
	global.ioUsers = {};

	//Associate express session with socket session
	app.get('io').use((socket, next) => {
		sessionMiddleware(socket.request, socket.request.res, next);
	});

	app.get('io').on('connection', socket => {
		if(socket.request.session.authenticated) {
			//Add userId to hash of corresponding socket ids
			//Remove from hash on disconnect
			global.ioUsers[socket.request.session.userId] = socket.id;
			socket.on('disconnect', () => delete global.ioUsers[socket.request.session.userId]);
			
			socket.on('message', data => require('./socket_routes')(data, socket));
		}

	});
};
const socketIo = require('socket.io');

module.exports = function ({ server, app }) {
	app.set('io', socketIo(server));

	app.get('io').on('connection', () => {
	})
};
let socketErrorHandler = require('../lib/socketErrorHandler');
let validate = require('../lib/validateSchema');

let messageController = require('../controllers/message');
let conversationController = require('../controllers/conversation');

let messageValidationSchema = {
	content: {
		type: 'string',
		required: true
	},
	conversationId: {
		type: 'integer',
		required: true
	}
};

module.exports = async function (data, socket, io) {
	try {
		validate(messageValidationSchema, data);
		if(!socket.request.session.authenticated) {
			throw new Error('unauthorised');
		}

		let message = await messageController.create({
			content: data.content,
			userId: socket.request.session.userId,
			conversationId: data.conversationId
		});


		//Get the users in the conversation and the id for the socket
		//(if it exists) and emit the message to them 
		let userIds = await conversationController.getUserIds(data.conversationId);
		userIds
			.map(id => global.ioUsers[id])
			.filter(id => id !== undefined)
			.forEach(id => {
				io.to(id).emit('message', message);
			});
	} catch (e) {
		socketErrorHandler(e, socket);
	}
};
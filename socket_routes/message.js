let socketErrorHandler = require('../lib/socketErrorHandler');
let validate = require('../lib/validateSchema');
let messageController = require('../controllers/message');

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

module.exports = async function (data, socket) {
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

		//socket response
	} catch (e) {
		socketErrorHandler(e, socket);
	}
};
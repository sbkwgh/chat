const socketErrorHandler = require('../lib/socketErrorHandler');
const validateSchema = require('../lib/validation/validateSchema');

const conversationController = require('../controllers/conversation');

/*
	data:
	{
		conversationId: integer
	}
*/
async function join (data, socket) {
	try {
		validateSchema({
			conversationId: {
				type: 'integer',
				required: true
			}
		}, data);

		const { conversationId } = data;
		const { userId } = socket.request.session;

		const conversationUsers = await conversationController.getUserIds(conversationId);
		if(!conversationUsers.includes(userId)) {
			throw new Error('unauthorised');
		}

		socket.join('conversation/' + conversationId);
	} catch (e) {
		socketErrorHandler(err, socket);
	}
};

function leave (data, socket) {
	socket.leave('conversation/' + data.conversationId)
}

module.exports = { join, leave };
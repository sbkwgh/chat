let Type = require('../lib/type');
let validationError = require('../lib/validationError');
let { Message, Sequelize, User, Conversation } = require('../models');

/*	params
		userId:			integer
		conversationId:	integer
		content:		string
*/
exports.create = async function (params) {
	let { content, userId, conversationId } = params;
	let user = await User.findById(userId);
	let conversation = await Conversation.findById(conversationId);

	if(!user) {
		throw validationError(Sequelize, {
			message: 'User does not exist',
			path: 'UserId'
		});
	}
	if(!conversation) {
		throw validationError(Sequelize, {
			message: 'Conversation does not exist',
			path: 'ConversationId'
		});
	}

	let message = await Message.create({ content });
	await message.setUser(user);
	await message.setConversation(conversation);

	return message;
}
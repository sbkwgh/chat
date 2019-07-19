let Type = require('../lib/validation/type');
let validationError = require('../lib/errors/validationError');
let { Message, User, Conversation, Sequelize } = require('../models');

/*	params
		userId:			integer
		conversationId:	integer
		content:		string
*/
exports.create = async function (params) {
	let { content, userId, conversationId } = params;

	let user = await User.findByPk(userId);
	if(!user) {
		throw validationError({
			message: 'User does not exist',
			path: 'UserId'
		});
	}

	let conversation = await Conversation.findByPk(conversationId, {
		include: [{
			model: User,
			where: { id: userId }
		}]
	});
	if(!conversation) {
		throw validationError({
			message: 'Conversation does not exist or user is not part of conversation',
			path: 'ConversationId'
		});
	}

	let message = await Message.create({ content });
	await message.setUser(user);
	await message.setConversation(conversation);
	await Conversation.update({ updatedAt: new Date() }, { where: { id: conversationId } });

	return message;
}
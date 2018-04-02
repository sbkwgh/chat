let Type = require('../lib/type');
let validationError = require('../lib/validationError');
let { User, Conversation, Message, Sequelize } = require('../models');

exports.create = async function (userIds, name) {
	//Remove duplicates
	let userIdsSet = new Set(
		userIds.filter(id => typeof id === 'number')
	);
	let userPromises = [];
	let users;

	userIdsSet.forEach(id => {
		userPromises.push(User.findById(id));
	});
	users = (await Promise.all(userPromises)).filter(user => user !== null);

	if(users.length > 1) {
		let defaultName = users.map(u => u.username).join(', ');

		let notNullUserIds = users.map(u => u.id);
		let existingConversation = await Conversation.findOne({
			where: { name: name || defaultName },
			includes: [{
				model: User,
				where: {
					id: { [Sequelize.Op.and]: notNullUserIds }
				}
			}]
		});

		if(existingConversation) {
			throw validationError(Sequelize, {
				message: 'A conversation with these people already exists',
				value: userIds
			});
		} else {
			let conversation = await Conversation.create({ name: name || defaultName });
			await conversation.addUsers(users);

			return conversation.toJSON();
		}
	} else {
		throw validationError(Sequelize, {
			message: 'At least two users required for a conversation',
			value: userIds
		});
	}
};

exports.getFromUser = async function (userId) {
	let conversations = await Conversation.findAll({
		include: [{
			model: User,
			where: { id: Type.number(userId) }
		}]
	});

	return conversations.map(c => c.toJSON());
};

exports.get = async function (userId, conversationId) {
	let conversation = await Conversation.findById(Type.number(conversationId), {
		include: [
			{
				model: User,
				where: { id: Type.number(userId) },
				attributes: { exclude: ['hash'] }
			},
			Message
		]
	});


	if(!conversation) {
		throw validationError(Sequelize, {
			message: 'Either the conversation doesn\'t exist or you\'re not part of the conversation'
		});
	} else {
		return conversation.toJSON();
	}
};
let Type = require('../lib/type');
let validationError = require('../lib/validationError');
let { User, Conversation, Message, UserConversation, Sequelize } = require('../models');

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
		let notNullUserIds = users.map(u => u.id).sort().join(',');
		let existingConversation = await Conversation.findOne({
			where: {
				groupUsers: notNullUserIds
			}
		});

		if(existingConversation) {
			throw validationError(Sequelize, {
				message: 'A conversation with these people already exists',
				value: userIds
			});
		} else {
			let conversation = await Conversation.create({ name, groupUsers: notNullUserIds });
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
	/*
		Should return an object like:
	
		{
			name,
			createdAt,
			updatedAt,
			id,
			
			Users: [ ... ],
			Messages: [ ... ]
		}

	*/

	let conversations = await Conversation.findAll({
		include: [
			{
				model: User,
				where: { id: userId },
				attributes: { exclude: ['hash'] }
			},
			{
				model: Message,
				include: [{
					model: User,
					attributes: { exclude: ['hash'] }
				}],
				limit: 1,
				order: [
					['id', 'DESC']
				]
			}
		],
		order: [
			['updatedAt', 'DESC']
		]
	});
	let conversationWithUsers = await Promise.all(
		conversations.map(c => c.setName(userId))
	);

	return conversationWithUsers.filter(c => c.Messages.length);
};

exports.get = async function (userId, conversationId) {
	let conversation = await Conversation.findById(Type.number(conversationId), {
		include: [
			{
				model: User,
				where: { id: Type.number(userId) },
				attributes: { exclude: ['hash'] }
			},
			{
				model: Message,
				include: [
					{
						model: User,
						attributes: { exclude: ['hash'] }
					}
				]
			}
		],
		order: [
			[Message, 'id', 'ASC']
		]
	});

	if(!conversation) {
		throw validationError(Sequelize, {
			message: 'Either the conversation doesn\'t exist or you\'re not part of the conversation'
		});
	} else {
		return await conversation.setName(userId);
	}
};
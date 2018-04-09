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
				limit: 1,
				order: [
					['id', 'DESC']
				],
				include: [
					{
						model: User,
						attributes: { exclude: [ 'hash' ] }
					} 
				]
			}
		],
		order: [
			['updatedAt', 'DESC']
		]
	});

	let conversationsWithUsersPromises = conversations.map(async conversation => {
		let withUsers = await Conversation.findById(conversation.id, {
			include: [User]
		});

		let json = conversation.toJSON();
		json.Users = withUsers.Users;

		return json;
	});
	let jsonConversations = await Promise.all(conversationsWithUsersPromises);
	let filtered = jsonConversations.filter(c => c.Messages.length);

	return filtered;
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
		return conversation.toJSON();
	}
};
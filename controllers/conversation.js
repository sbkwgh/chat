let Type = require('../lib/type');
let validationError = require('../lib/validationError');
let {
	User,
	Conversation,
	Message,
	UserConversation,
	Sequelize,
} = require('../models');
let sequelizeInstance = require('../models').sequelize;

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

exports.getFromUser = async function (userId, page, searchString) {
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
	
	let usernames = (searchString || '').split(/\s+/);
	let replacementsObj = {
		offset: (page || 0) * 10,
		usernamesLen: usernames.length,
		usernames: usernames.join('|'),
		userId
	 };

	let orClause = '';
	if(usernames[0]) {
		orClause = 'OR users.username RLIKE :usernames'
		replacementsObj.usernamesLen++;
	}

	let sql = `
		SELECT
			conversations.*,
			messages.content as 'Messages.content',
			users.username as 'User.username',
			users.id as 'User.id'

		FROM
			(
				SELECT ConversationId
				FROM userconversations
				INNER JOIN users
				ON userconversations.UserId = users.id
				WHERE users.id = :userId ${orClause}
				GROUP BY userconversations.ConversationId
				HAVING count(*) = :usernamesLen
			) q
		JOIN conversations
			ON conversations.id = q.ConversationId
		JOIN messages
			ON conversations.id = messages.ConversationId AND messages.id in
				(
					SELECT MAX(id)
					FROM messages
					WHERE messages.ConversationId = conversations.id
				)
		JOIN users
			ON users.id = messages.UserId

		ORDER BY messages.id DESC

		LIMIT 10
		OFFSET :offset
	`;

	let conversations = await sequelizeInstance.query(sql, {
		replacements: replacementsObj,
		type: sequelizeInstance.QueryTypes.SELECT,
		model: Conversation
	});

	let mappedPropertiesPromises = conversations.map(async conversation => {
		let json = await conversation.setName(userId);

		json.Messages = [{
			content: json['Messages.content'],
			User: {
				id: json['User.id'],
				username: json['User.username']
			}
		}];

		delete json['Messages.content'];
		delete json['User.id'];
		delete json['User.username'];

		return json;
	});
	let mappedProperties = await Promise.all(mappedPropertiesPromises);

	return {
		Conversations: mappedProperties,
		continuePagination: mappedProperties.length === 10
	};
};

exports.get = async function (userId, conversationId, page) {
	let messageCount = await Message.count({
		where: {
			ConversationId: conversationId
		}
	});

	let offset = messageCount - (page || 1) * 10;
	let limit = 10;
	if(offset < 0) {
		limit = 10 + offset;
		offset = 0;
	}

	let conversation = await Conversation.findById(conversationId, {
		include: [
			{
				model: User,
				where: { id: userId },
				attributes: { exclude: ['hash'] }
			},
			{
				model: Message,
				include: [
					{
						model: User,
						attributes: { exclude: ['hash'] }
					}
				],
				limit,
				offset,
				order: [['id', 'ASC']]
			}
		]
	});

	if(!conversation) {
		throw validationError(Sequelize, {
			message: 'Either the conversation doesn\'t exist or you\'re not part of the conversation'
		});
	} else {
		let json = await conversation.setName(userId);
		json.continuePagination = !!offset;

		return json;
	}
};

exports.getUserIds = async function (conversationId) {
	let conversation = await Conversation.findById(conversationId, {
		include: [{ model: User }]
	});

	if(!conversation) {
		throw validationError(Sequelize, {
			message: 'The conversation doesn\'t exist'
		});
	} else {
		return conversation.Users.map(user => user.id);
	}
}
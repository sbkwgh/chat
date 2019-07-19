let Type = require('../lib/validation/type');
let validationError = require('../lib/errors/validationError');
let {
	User,
	Conversation, 
	Message, 
	UserConversation,
	Sequelize
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
		userPromises.push(User.findByPk(id));
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
			throw validationError({
				message: 'A conversation with these people already exists',
				value: userIds
			});
		} else {
			let conversation = await Conversation.create({ name, groupUsers: notNullUserIds });
			await conversation.addUsers(users);

			return conversation.toJSON();
		}
	} else {
		throw validationError({
			message: 'At least two users required for a conversation',
			value: userIds
		});
	}
};

/*
	userId of current user
	page to search on (offset)
	searchString of usernames given by user
*/
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
	
	//Assuming that search string is a list of usernames
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
			messages.createdAt as 'Messages.createdAt',
			users.username as 'User.username',
			users.id as 'User.id',
			userconversations.lastRead as 'lastRead'

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
		JOIN userconversations
			ON userconversations.UserId = users.id AND userconversations.ConversationId = conversations.id

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
			createdAt: json['Messages.createdAt'],
			User: {
				id: json['User.id'],
				username: json['User.username']
			}
		}];

		delete json['Messages.content'];
		delete json['Messages.createdAt'];
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

	let conversation = await Conversation.findByPk(conversationId, {
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
		throw validationError({
			message: 'Either the conversation doesn\'t exist or you\'re not part of the conversation'
		});
	} else {
		let json = await conversation.setName(userId);
		json.continuePagination = !!offset;

		return json;
	}
};

exports.getUserIds = async function (conversationId) {
	let conversation = await Conversation.findByPk(conversationId, {
		include: [{ model: User }]
	});

	if(!conversation) {
		throw validationError({
			message: 'The conversation doesn\'t exist'
		});
	} else {
		return conversation.Users.map(user => user.id);
	}
};

exports.updateLastRead = async function (conversationId, userId) {
	let res = await UserConversation.update({
		lastRead: new Date()
	}, {
		where: { ConversationId: conversationId, UserId: userId }
	});

	//Affected rows should always be 1
	if(res[0] !== 1) {
		throw validationError({
			message: 'Either the conversationId or UserId is invalid'
		});
	} else {
		return true;
	}
};

exports.updateName = async function (conversationId, userId, name) {
	let conversation = await Conversation.findByPk(conversationId, {
		include: [{ model: User }]
	});
	
	if(
		!conversation ||
		conversation.Users.find(u => u.id === userId) === undefined
	) {
		throw validationError({
			message: 'Either the conversationId or userId is invalid'
		});
	}

	let res = await Conversation.update({ name }, {
		where: { id: conversationId }
	});

	return true;
};
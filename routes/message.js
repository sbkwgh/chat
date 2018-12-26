let validation = require('../lib/validation/validateMiddleware');
let router = require('express').Router();

let conversationController = require('../controllers/conversation');
let messageController = require('../controllers/message');
let userController = require('../controllers/user');

router.all('*', (req, res, next) => {
	if(!req.session.authenticated) {
		res.status(401);
		res.json({
			errors: [ { message: 'Request not authorized' } ]
		})
	} else {
		next();
	}
});

let messageValidationSchema = {
	body: {
		content: {
			type: 'string',
			required: true
		},
		conversationId: {
			type: 'integer',
			required: true
		}
	}
};
router.post('/', validation(messageValidationSchema), async (req, res, next) => {
	try {
		let message = await messageController.create({
			content: req.body.content,
			userId: req.session.userId,
			conversationId: req.body.conversationId
		});
		let user = await userController.get(req.session.userId);
		let retMessage = Object.assign(message.toJSON(), {
			User: user
		});

		let conversations = await conversationController.getFromUser(req.session.userId);
		let retConversation = conversations.Conversations[0];

		//Get the users in the conversation and the id for the socket
		//(if it exists) and emit the message to them 
		let userIds = await conversationController.getUserIds(req.body.conversationId);
		userIds
			.map(id => req.app.get('io-users')[id])
			.filter(id => id !== undefined)
			.forEach(id => {
				req.app.get('io').to(id).emit('message', retMessage);
				req.app.get('io').to(id).emit('conversation', retConversation);
			});

		res.json(retMessage);
	} catch (e) { next(e); }
});

module.exports = router;
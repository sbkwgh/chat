let validation = require('../lib/validation');
let messageController = require('../controllers/message');
let router = require('express').Router();

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

		res.json(message);
	} catch (e) { next(e); }
});

module.exports = router;
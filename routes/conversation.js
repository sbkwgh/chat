let validation = require('../lib/validation/validateMiddleware');
let conversationController = require('../controllers/conversation');
let router = require('express').Router();

router.all('*', (req, res, next) => {
	if(!req.session.authenticated) {
		res.status(401);
		res.json({
			errors: [{ message: 'Request not authorized' }]
		})
	} else {
		next();
	}
});

let createPostSchema = {
	body: {
		userIds: {
			required: true,
			type: 'array.integer'
		},
		name: {
			required: false,
			type: 'string'
		}
	}
};
router.post('/', validation(createPostSchema), async (req, res, next) => {
	try {
		let conversation = await conversationController.create(
			req.body.userIds,
			req.body.name
		);

		res.json(conversation);
	} catch (e) { next(e); }
});

let getPostSchema = {
	params: {
		conversationId: {
			required: true,
			type: 'string(integer)'
		}
	},
	query: {
		page: {
			required: false,
			type: 'string(integer)'
		}
	}
};
router.get('/:conversationId', validation(getPostSchema), async (req, res, next) => {
	try {
		let conversation = await conversationController.get(
			req.session.userId, +req.params.conversationId, +req.query.page
		);

		res.json(conversation);
	} catch (e) { next(e); }
});

let putPostSchema = {
	params: {
		conversationId: {
			required: true,
			type: 'string(integer)'
		}
	}
};
router.put('/:conversationId', validation(putPostSchema), async (req, res, next) => {
	try {
		let conversationId = +req.params.conversationId;
		res.json(
			await conversationController.updateLastRead(conversationId, req.session.userId)
		);
	} catch (e) { next(e); }
});

let putNameSchema = {
	params: {
		conversationId: {
			required: true,
			type: 'string(integer)'
		}
	},
	body: {
		name: {
			required: true,
			type: 'string'
		}
	}
};
router.put('/:conversationId/name', validation(putNameSchema), async (req, res, next) => {
	try {
		let conversationId = +req.params.conversationId;
		let name = req.body.name;

		res.json(
			await conversationController.updateName(conversationId, req.session.userId, name)
		);
	} catch (e) { next(e); }
});

module.exports = router;
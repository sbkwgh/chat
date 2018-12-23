let validation = require('../lib/validateMiddleware');
let userController = require('../controllers/user');
let conversationController = require('../controllers/conversation');
let router = require('express').Router();

function setSession (req, res, user) {
	req.session.authenticated = true;
	req.session.userId = user.id;
	
	res.cookie('username', user.username);
	res.cookie('id', user.id);
}
function clearSession (req, res) {
	req.session.destroy();
	res.clearCookie('username');
	res.clearCookie('id');
}

let userBodySchema = {
	body: {
		username: {
			required: true,
			type: 'string'
		},
		password: {
			required: true,
			type: 'string'
		}
	}
};
let userIdParamsSchema = {
	params: {
		userId: {
			type: 'string(integer)',
			required: true
		}
	}
};
let getConversationsParamsSchema = {
	params: {
		userId: {
			type: 'string(integer)',
			required: true
		}
	},
	query: {
		page: {
			type: 'string(integer)',
			required: false
		},
		search: {
			type: 'string',
			required: false
		}
	}
};

router.post('/', validation(userBodySchema), async (req, res, next) => {
	try {
		let user = await userController.create(
			req.body.username,
			req.body.password
		);
		
		setSession(req, res, user);

		res.json(user);
	} catch (e) { next(e); }
});

router.post('/login', validation(userBodySchema), async (req, res, next) => {
	try {
		let user = await userController.login(
			req.body.username,
			req.body.password
		);

		setSession(req, res, user);

		res.json(user);
	} catch (e) { next(e); }
});

router.post('/logout', async (req, res, next) => {
	try {
		clearSession(req, res);
		res.send({ success: true });
	} catch (e) { next(e); }
});

router.get('/:userId', validation(userIdParamsSchema), async (req, res, next) => {
	try {
		let user = await userController.get(+req.params.userId);

		res.json(user);
	} catch (e) { next(e) };
});

router.get('/search/:username', async (req, res, next) => {
	try {
		let users = await userController.getAllBeginningWith(req.params.username);

		res.json(users);
	} catch (e) { next(e) };
});

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

router.get('/:userId/conversations', validation(getConversationsParamsSchema), async (req, res, next) => {
	try {
		let id = +req.params.userId;

		if(req.session.userId !== id) {
			throw new Error('unauthorized');
		}

		let conversations = await conversationController.getFromUser(id, +req.query.page, req.query.search);
		res.json(conversations);
	} catch (e) { next(e); }
});

module.exports = router;
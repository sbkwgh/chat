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

router.post('/', async (req, res, next) => {
	try {
		let conversation = await conversationController.create(
			req.body.userIds,
			req.body.name
		);

		res.json(conversation);
	} catch (e) { next(e); }
});

router.get('/:user_id', async (req, res, next) => {
	try {
		let id = +req.params.user_id;

		if(req.session.userId !== id) {
			throw new Error('unauthorized');
		}

		let conversations = await conversationController.getFromUser(id);
		res.json(conversations);
	} catch (e) { next(e); }
});

module.exports = router;
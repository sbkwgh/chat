let userController = require('../controllers/user');
let conversationController = require('../controllers/conversation');
let router = require('express').Router();

function setSession (req, res, user) {
	req.session.authenticated = true;
	req.session.userId = user.id;
	
	res.cookie('username', user.username);
	res.cookie('id', user.id);
}
function clearSession (req) {
	req.session.destroy();
	res.clearCookie('username');
	res.clearCookie('id');
}

router.post('/', async (req, res, next) => {
	try {
		let user = await userController.create(
			req.body.username || '',
			req.body.password || ''
		);
		
		setSession(req, res, user);

		res.json(user);
	} catch (e) { next(e); }
});

router.post('/login', async (req, res, next) => {
	try {
		let user = await userController.login(
			req.body.username || '',
			req.body.password || ''
		);

		setSession(req, res, user);

		res.json(user);
	} catch (e) { next(e); }
});

router.get('/:id', async (req, res, next) => {
	try {
		let user = await userController.get(+req.params.id);

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

router.get('/:user_id/conversations', async (req, res, next) => {
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
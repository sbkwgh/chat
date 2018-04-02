let userController = require('../controllers/user');
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

router.get('/:username_id', async (req, res, next) => {
	try {
		let user = await userController.get(req.params.username_id);

		res.json(user);
	} catch (e) { next(e) };
});

module.exports = router;
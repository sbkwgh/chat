const { Sequelize } = require('./models');
const sockets = require('./sockets');
const express = require('express');
const app = express();

const env = process.env;
const port = env.PORT || 3000;

const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

app.set('trust proxy', true);

const sessionMiddleware = session({
	secret: env.SECRET || 'secret',
	resave: false,
	saveUninitialized: true,
	cookie: { secure: env.NODE_ENV === 'production' }
});

app.use(sessionMiddleware);
app.use(cookieParser(
	env.SECRET || 'secret'
));
app.use(bodyParser.json());

app.use('/api/user', require('./routes/user'));
app.use('/api/conversation', require('./routes/conversation'));
app.use('/api/message', require('./routes/message'));

app.use((err, req, res, next) => {
	if(err.constructor === Sequelize.ValidationError) {
		res.status(400);
		res.json(err);
	} else if (err.message === 'unauthorized') {
		res.status(401);
		res.json({
			errors: [{ message: 'Request not authorized' }]
		});
	} else {
		console.log(err);

		res.status(500)
		res.json({
			errors: [{ message: 'There was an unknown error on our side - please try again later' }]
		});
	}
});

let server = app.listen(port, () => {
	app.emit('server started');
	app.set('server started', true);
});
sockets({ server, app, sessionMiddleware });

module.exports = { server, app };



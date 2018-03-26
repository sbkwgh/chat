const { sequelize } = require('./models');
const express = require('express');
const app = express();

const env = process.env;
const port = env.PORT || 3000;

const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

app.set('trust proxy', true);
app.use(session({
	secret: env.SECRET || 'secret',
	resave: false,
	saveUninitialized: true,
	cookie: { secure: env.NODE_ENV === 'production' }
}))
app.use(cookieParser(
	env.SECRET || 'secret'
));
app.use(bodyParser.json());

app.use('/api/user', require('./routes/user'));

app.use((err, req, res, next) => {
	if(err instanceof sequelize.ValidationError) {
		res.status(400);
		res.json(err);
	} else {
		console.log(err);

		res.status(500)
		res.json({
			errors: ['There was an unknown error on our side - please try again later']
		});
	}
});

let server = app.listen(port, () => {
	app.emit('server started');
	app.set('server started', true);
});

module.exports = { server, app };



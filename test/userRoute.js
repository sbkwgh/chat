let chai = require('chai');
	let expect = chai.expect;
	let should = chai.should();

chai.use(require('chai-http'));
chai.use(require('chai-things'));

let { server, app } = require('../server');

let models = require('../models');
	let { Sequelize, User } = models;
	let sequelizeInstance = models.sequelize;
let userController = require('../controllers/user.js');

describe('User route', () => {
	before(done => {
		let synchDb = () => {
			sequelizeInstance
				.sync({ force: true })
				.then(() => done())
				.catch(done);
		};

		app.on('serverStarted', synchDb);
		if(app.get('server started')) { synchDb(); }
	})

	after(() => {
		sequelizeInstance.close();
		server.close();
	});

	describe('POST /', () => {
		it('should create an account', async () => {
			let res = await chai.request(server)
				.post('/api/user')
				.set('content-type', 'application/json')
				.send({
					username: 'username',
					password: 'password'
				});

			res.should.have.status(200);
			res.should.be.json;
			res.body.should.have.property('username', 'username');
			res.body.should.not.have.property('hash');

			res.should.have.cookie('username', 'username');
			res.should.have.cookie('id', '1');

			let user = await User.findById(1);
			user.should.not.be.null;
			user.should.have.property('username', 'username');
		});

		it('should return an error if no username or password provided', done => {
			chai.request(server)
				.post('/api/user')
				.set('content-type', 'application/json')
				.send()
				.end((err, res) => {
					res.should.have.status(400);
					res.should.be.json;
					res.body.errors.should.contain.something.with.property('message', 'Username must be at least 6 characters');
					res.body.errors.should.contain.something.with.property('message', 'Password must be at least 8 characters');

					done();
				})
		})
	});
	describe('POST /login', () => {
		it('should login', async () => {
			let res = await chai.request(server)
				.post('/api/user/login')
				.set('content-type', 'application/json')
				.send({
					username: 'username',
					password: 'password'
				});

			res.should.have.status(200);
			res.should.be.json;
			res.body.should.have.property('username', 'username');
			res.body.should.not.have.property('hash');

			res.should.have.cookie('username', 'username');
			res.should.have.cookie('id', '1');
		});

		it('should return an error if no username or password provided', done => {
			chai.request(server)
				.post('/api/user/login')
				.set('content-type', 'application/json')
				.send()
				.end((err, res) => {
					res.should.have.status(400);
					res.should.be.json;
					res.body.errors.should.contain.something.with.property('message', 'Username is incorrect');

					done();
				})
		})
	});
	describe('GET /', () => {
		it('should get an account', async () => {
			let res = await chai.request(server)
				.get('/api/user/username')

			res.should.have.status(200);
			res.should.be.json;
			res.body.should.have.property('username', 'username');
			res.body.should.not.have.property('hash');
		});

		it('should return an error if no username given', done => {
			chai.request(server)
				.get('/api/user/notanccount')
				.end((err, res) => {
					res.should.have.status(400);
					res.should.be.json;
					res.body.errors.should.contain.something.with.property('message', 'User does not exist');

					done();
				})
		})
	});
})
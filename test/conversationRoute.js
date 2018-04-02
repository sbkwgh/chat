let chai = require('chai');
	let expect = chai.expect;
	let should = chai.should();

chai.use(require('chai-http'));
chai.use(require('chai-things'));

let { server, app } = require('../server');

let models = require('../models');
	let { Sequelize, User, Conversation } = models;
	let sequelizeInstance = models.sequelize;
let userController = require('../controllers/user.js');

let userAgent = chai.request.agent(server);
let userTwoAgent = chai.request.agent(server);

describe('Conversation route', () => {
	before(done => {
		function createAccounts () {
			let users = [
				{ username: 'user_one', hash: 'password' },
				{ username: 'user_two', hash: 'password' },
				{ username: 'user_three', hash: 'password' }
			];

			User
				.create(users[0])
				.then(() => User.create(users[1]))
				.then(() => User.create(users[2]))
				.then(() => {
					let promises = [];

					promises.push(
						userAgent
						.post('/api/user/login')
						.set('content-type', 'application/json')
						.send({
							username: 'user_one',
							password: 'password'
						})
					);
					promises.push(
						userTwoAgent
						.post('/api/user/login')
						.set('content-type', 'application/json')
						.send({
							username: 'user_two',
							password: 'password'
						})
					);

					return Promise.all(promises);
				})
				.then(() => {
					done();
				})
				.catch(e => {
					console.log(e);
					done(e);
				});
		}

		app.on('server started', createAccounts);
		if(app.get('server started')) { createAccounts(); }
	})

	after(done => {
		sequelizeInstance
			.sync({ force: true })
			.then(() => done())
			.catch(done);
	});

	describe('POST /', () => {
		it('should return an error if not logged in', done => {
			chai.request.agent(server).post('/api/conversation')
				.set('content-type', 'application/json')
				.send({
					userIds: [1,2,3]
				})
				.end((err, res) => {
					res.body.errors.should.contain.something.with.property('message', 'Request not authorized')
					done();
				})
		});
		it('should create a conversation', async () => {
			let res = await userAgent
				.post('/api/conversation')
				.set('content-type', 'application/json')
				.send({
					userIds: [1,2,3]
				});

			let conversation = await Conversation.findById(1);
			conversation.should.have.property('name', 'user_one, user_two, user_three');
		});
	});

	describe('GET /', () => {
		it('should get a list of conversation from a user', async () => {
			let res = await userAgent.get('/api/user/1/conversations');

			res.body.length.should.equal(1);
			res.body.should.contain.something.with.property('name', 'user_one, user_two, user_three');
		});
		it('should return an error if not same account', done => {
			userTwoAgent
				.get('/api/user/1/conversations')
				.end((err, res) => {
					res.body.errors.should.contain.something.with.property('message', 'Request not authorized')
					done();
				})
		});
	});
})
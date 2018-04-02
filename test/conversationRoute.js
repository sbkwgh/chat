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
let messageController = require('../controllers/message.js');

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

	describe('GET /api/user/:id/conversations', () => {
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

	describe('GET /:id', () => {
		before(async () => {
			await messageController.create({
				userId: 1,
				conversationId: 1,
				content: 'message 1'
			});
			await messageController.create({
				userId: 2,
				conversationId: 1,
				content: 'message 2'
			});
			await messageController.create({
				userId: 1,
				conversationId: 1,
				content: 'message 3'
			});
		});

		it('should get a conversation and messages', async () => {
			let res = await userAgent.get('/api/conversation/1');

			res.body.name.should.equal('user_one, user_two, user_three')

			res.body.Messages.length.should.equal(3);
			res.body.Messages[2].should.have.property('content', 'message 3');
		});
		it('should return an error if user is not logged in', done => {
			chai.request(server)
				.get('/api/conversation/1')
				.end((err, res) => {
					res.body.errors.should.contain.something.with.property('message', 'Request not authorized')
					done();
				})
		});
	});
})
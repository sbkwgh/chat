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
let conversationController = require('../controllers/conversation.js');

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
		it('should return an error if userIds or name of wrong type', done => {
			userAgent
				.post('/api/conversation')
				.set('content-type', 'application/json')
				.send({
					userIds: [1,2,null],
					name: {}
				})
				.end((err, res) => {
					res.body.errors.should.contain.something.with.property('message', 'userIds must be of type array.integer')
					res.body.errors.should.contain.something.with.property('message', 'name must be of type string')
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
			conversation.should.not.be.null;
		});
	});

	describe('GET /api/user/:id/conversations', () => {
		it('should get a list of conversation from a user', async () => {
			await messageController.create({ userId: 1, conversationId: 1, content: 'message 1' });
			let res = await userAgent.get('/api/user/1/conversations?page=0');

			res.body.Conversations.length.should.equal(1);
			res.body.Conversations.should.contain.something.with.property('name', 'user_one, user_two, user_three');
		});
		it('should return an error if not same account', done => {
			userTwoAgent
				.get('/api/user/1/conversations')
				.end((err, res) => {
					res.body.errors.should.contain.something.with.property('message', 'Request not authorized')
					done();
				})
		});
		it('should return an error if userId not a number, page not a number', done => {
			userAgent.get('/api/user/null/conversations?page=false')
				.end((err, res) => {
					res.body.errors.should.contain.something.with.property('message', 'userId must be of type string(integer)')
					res.body.errors.should.contain.something.with.property('message', 'page must be of type string(integer)')
					done();
				})
		});
	});

	describe('GET /:id', () => {
		before(async () => {
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
		it('should return an error if userId not an integer', done => {
			userAgent
				.get('/api/conversation/false')
				.end((err, res) => {
					res.body.errors.should.contain.something.with.property('message', 'conversationId must be of type string(integer)')
					done();
				})
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

	describe('PUT /:id/name', () => {
		it('should update the name', async () => {
			let agent = chai.request.agent(server);
			await agent
				.post('/api/user/login')
				.set('content-type', 'application/json')
				.send({
					username: 'user_one',
					password: 'password'
				})


			let res = await agent
				.put('/api/conversation/1/name')
				.set('content-type', 'application/json')
				.send({
					name: 'new name'
				});

			res.body.should.equal(true);

			let conversation = await conversationController.get(1, 1);
			conversation.name.should.equal('new name');
		});
		it('should return an error if user is not logged in', done => {
			chai.request(server)
				.put('/api/conversation/1/name')
				.set('content-type', 'application/json')
				.send({
					name: 'new name'
				})
				.end((err, res) => {
					res.body.errors.should.contain.something.with.property('message', 'Request not authorized')
					done();
				})
		});
	});
})
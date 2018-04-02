let chai = require('chai');
	let expect = chai.expect;
	let should = chai.should();

chai.use(require('chai-http'));
chai.use(require('chai-things'));

let { server, app } = require('../server');

let models = require('../models');
	let { Sequelize, User, Message } = models;
	let sequelizeInstance = models.sequelize;
let userController = require('../controllers/user.js');
let conversationController = require('../controllers/conversation.js');

let userAgent = chai.request.agent(server);
let userTwoAgent = chai.request.agent(server);

describe('Message route', () => {
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
				.then(() => conversationController.create([1,2]))
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
			chai.request.agent(server).post('/api/message')
				.set('content-type', 'application/json')
				.send({
					content: 'test',
					conversationId: 1
				})
				.end((err, res) => {
					res.body.errors.should.contain.something.with.property('message', 'Request not authorized')
					done();
				})
		});
		it('should create a message', async () => {
			let res = await userAgent
				.post('/api/message')
				.set('content-type', 'application/json')
				.send({
					content: 'test',
					conversationId: 1
				});

			res.body.should.have.property('content', 'test');

			let message = await Message.findById(1);

			message.should.have.property('content', 'test');
			message.should.have.property('UserId', 1);
			message.should.have.property('ConversationId', 1);
		});
	});
})
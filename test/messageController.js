let chai = require('chai');
	let expect = chai.expect;
	let should = chai.should();
chai.use(require('chai-things'));

let models = require('../models');
	let { Sequelize, User, Message } = models;
	let sequelizeInstance = models.sequelize;
let conversationController = require('../controllers/conversation');
let messageController = require('../controllers/message');


describe('Message controller', () => {
	before(async () => {
		let users = [
			{ username: 'user_one', hash: 'password' },
			{ username: 'user_two', hash: 'password' },
			{ username: 'user_three', hash: 'password' }
		];

		for(user of users) {
			await User.create(user);
		}

		await conversationController.create([1,2,3], 'group');
		await conversationController.create([1,2]);
	});

	after(async () => {
		await sequelizeInstance.sync({ force: true });
	});

	describe('create', () => {
		it('should create a message', async () => {
			message = await messageController.create({
				content: 'test',
				conversationId: 1,
				userId: 1
			});
			message.should.have.property('content', 'test');

			let res = await Message.findById(1);
			res.should.have.property('content', 'test');
		});
		it('should return an error if message length is 0', async () => {
			try {
				await messageController.create({
					content: '      	    ',
					userId: 1,
					conversationId: 1
				})
				expect(true).to.be.false
			} catch (e) {
				e.errors.should.contain.something.with.property('message', 'Message cannot be blank');
			}
		});
		it('should return an error if message is not given', async () => {
			try {
				await messageController.create({
					userId: 1,
					conversationId: 1
				})
				expect(true).to.be.false
			} catch (e) {
				e.errors.should.contain.something.with.property('message', 'Message.content cannot be null');
			}
		});

		it('should return an error if userId is not given', async () => {
			try {
				await messageController.create({
					content: 'test123',
					conversationId: 1
				})
				expect(true).to.be.false
			} catch (e) {
				e.errors.should.contain.something.with.property('message', 'User does not exist')
			}
		});
		it('should return an error if userId is invalid', async () => {
			try {
				await messageController.create({
					content: 'test123',
					conversationId: 1,
					userId: 'notreallll'
				})
				expect(true).to.be.false
			} catch (e) {
				e.errors.should.contain.something.with.property('message', 'User does not exist')
			}
		});
		it('should return an error if conversationId is not given', async () => {
			try {
				await messageController.create({
					content: 'sdfghyt',
					userId: 1
				})
				expect(true).to.be.false
			} catch (e) {
				e.errors.should.contain.something.with.property('message', 'Conversation does not exist or user is not part of conversation')
			}
		});
		it('should return an error if user is not part of conversation', async () => {
			try {
				await messageController.create({
					content: 'sdfghyt',
					userId: 3,
					conversationId: 2
				})
				expect(true).to.be.false
			} catch (e) {
				e.errors.should.contain.something.with.property('message', 'Conversation does not exist or user is not part of conversation')
			}
		});
		it('should return an error if conversationId is invalid', async () => {
			try {
				await messageController.create({
					content: 'sdfghyt',
					userId: 1,
					conversationId: 'notreaal'
				})
				expect(true).to.be.false
			} catch (e) {
				e.errors.should.contain.something.with.property('message', 'Conversation does not exist or user is not part of conversation')
			}
		});
	});
})
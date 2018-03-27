let chai = require('chai');
	let expect = chai.expect;
	let should = chai.should();
chai.use(require('chai-things'));

let models = require('../models');
	let { Sequelize, User, Conversation } = models;
	let sequelizeInstance = models.sequelize;
let conversationController = require('../controllers/conversation');


describe('Conversation controller', () => {
	before(async () => {
		let users = [
			{ username: 'user_one', hash: 'password' },
			{ username: 'user_two', hash: 'password' },
			{ username: 'user_three', hash: 'password' }
		];

		for(user of users) {
			await User.create(user);
		}
	});

	after(async () => {
		await sequelizeInstance.sync({ force: true });
	});

	describe('create', () => {
		it('should create a new conversation', async () => {
			let res = await conversationController.create([1,2]);
			res.should.have.property('name', 'user_one, user_two');

			let conversation = await Conversation.findById(1, { include: [ User ] });
			conversation.should.have.property('name', 'user_one, user_two');
			conversation.Users.should.include.something.with.property('username', 'user_one');
			conversation.Users.should.include.something.with.property('username', 'user_two');
		});

		it('should create a new conversation with a custom name', async () => {
			let res = await conversationController.create([1, 2, 3], 'group name');
			res.should.have.property('name', 'group name');

			let conversation = await Conversation.findById(2, { include: [ User ] });
			conversation.should.have.property('name', 'group name');
			conversation.Users.should.include.something.with.property('username', 'user_one');
			conversation.Users.should.include.something.with.property('username', 'user_two');
			conversation.Users.should.include.something.with.property('username', 'user_three');
		});

		it('should return an error if the group already exists', async () => {
			try {
				await conversationController.create([1, 2, 3], 'group name');
				expect(true).not.to.be.true;
			} catch (e) {
				e.errors.should.contain.something.with.property('message', 'A conversation with these people already exists');
			}
		});
		it('should return an error if the name is greater than 1000 characters', async () => {
			try {
				await conversationController.create([1, 2, 3], '1'.repeat(1001));
				expect(true).not.to.be.true;
			} catch (e) {
				e.errors.should.contain.something.with.property('message', 'Name must be 1000 characters or less');
			}
		});
		it('should return an error if the name is not a string', async () => {
			try {
				await conversationController.create([1, 2, 3], 3);
				expect(true).not.to.be.true;
			} catch (e) {
				e.errors.should.contain.something.with.property('message', 'Name must be of type string');
			}
		});
		it('should return an error if not enough ids provided', async () => {
			try {
				await conversationController.create([]);
				expect(true).not.to.be.true;
			} catch (e) {
				e.errors.should.contain.something.with.property('message', 'At least two users required for a conversation');
			}
		});
		it('should return an error if no valid ids provided', async () => {
			try {
				await conversationController.create([5,6]);
				expect(true).not.to.be.true;
			} catch (e) {
				e.errors.should.contain.something.with.property('message', 'At least two users required for a conversation');
			}
		});
		it('should return an error if non integer ids provided', async () => {
			try {
				await conversationController.create([null, true, 'test']);
				expect(true).not.to.be.true;
			} catch (e) {
				e.errors.should.contain.something.with.property('message', 'At least two users required for a conversation');
			}
		});
	});
	describe('getFromUser', () => {
		it('should return a list of conversations', async () => {
			let res = await conversationController.getFromUser(1);
			res.should.have.length(2);
			res.should.contain.something.with.property('name', 'user_one, user_two');
			res.should.contain.something.with.property('name', 'group name');
		});
		it('should return [] from a non-existent user', async () => {
			let res = await conversationController.getFromUser(10);
			res.should.have.length(0);
		});
		it('should return an error from with an invalid datatype', async () => {
			try {
				await conversationController.getFromUser({});
			} catch (e) {
				e.errors.should.contain.something.with.property('message', 'Parameter must be of type number');
			}
		});
	});
})
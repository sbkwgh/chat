let chai = require('chai');
	let expect = chai.expect;
	let should = chai.should();
chai.use(require('chai-things'));

let models = require('../models');
	let { Sequelize, User, Conversation, Message, UserConversation } = models;
	let sequelizeInstance = models.sequelize;
let conversationController = require('../controllers/conversation');
let messageController = require('../controllers/message');


describe('Conversation controller', () => {
	before(async () => {
		let users = [
			{ username: 'user_one', hash: 'password' },
			{ username: 'user_two', hash: 'password' },
			{ username: 'user_three', hash: 'password' },
			{ username: 'user_four', hash: 'password' }
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
			res.should.have.property('name', undefined);

			let conversation = await Conversation.findById(1, { include: [ User ] });
			conversation.should.have.property('name', null);
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
				await conversationController.create([1, 2, 4], '1'.repeat(1001));
				expect(true).not.to.be.true;
			} catch (e) {
				e.errors.should.contain.something.with.property('message', 'Name must be 1000 characters or less');
			}
		});
		it('should return an error if the name is not a string', async () => {
			try {
				await conversationController.create([1, 2, 4], 3);
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
	describe('updateLastRead', () => {
		it('should update the time when last read', async () => {
			let uc = await UserConversation.findOne({
				where: { UserId: 1, ConversationId: 1 }
			});
			expect(uc.lastRead.getTime() === (new Date(0)).getTime()).to.be.true;

			let res = await conversationController.updateLastRead(1, 1);
			res.should.equal(true);

			let ucUpdated = await UserConversation.findOne({
				where: { UserId: 1, ConversationId: 1 }
			});
			expect(ucUpdated.lastRead.toDateString() === (new Date()).toDateString() ).to.be.true;
		});

		it('should throw an error if user or conversation does not exist', async () => {
			try {
				let uc = await UserConversation.findOne({
					where: { UserId: 10, ConversationId: 1 }
				});
			} catch (e) {
				e.errors.should.contain.something.with.property('message', 'Either the conversationId or UserId is invalid');
			}
		});
	});
	describe('getFromUser', () => {
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


		it('should return a list of conversations', async () => {
			let res = await conversationController.getFromUser(1);

			res.Conversations.should.have.length(1);
			res.Conversations[0].should.have.property('name', 'user_two');
			res.Conversations[0].should.have.property('lastRead');
			res.Conversations[0].Users.should.contain.something.with.property('username', 'user_one');
			res.Conversations[0].Users.should.contain.something.with.property('username', 'user_two');
			res.Conversations[0].Messages[0].should.have.property('content', 'message 3');
			res.Conversations[0].Messages[0].User.should.have.property('username', 'user_one');
			res.Conversations[0].Messages.should.have.length(1);
		});
		it('should return [] from a non-existent user', async () => {
			let res = await conversationController.getFromUser(10);
			res.Conversations.should.have.length(0);
		});
	});

	describe('get', () => {
		it('should get conversation and messages', async () => {
			let conversation = await conversationController.get(1, 1);
			
			conversation.should.have.property('name', 'user_two');
			conversation.Users.should.contain.something.with.property('username', 'user_one');
			conversation.Users.should.contain.something.with.property('username', 'user_two');
			conversation.Messages.length.should.equal(3);

			conversation.Messages[0].should.have.property('content', 'message 1');
			conversation.Messages[1].should.have.property('content', 'message 2');
			conversation.Messages[2].should.have.property('content', 'message 3');

			conversation.Messages[0].should.have.property('UserId', 1);
			conversation.Messages[1].should.have.property('UserId', 2);
			conversation.Messages[2].should.have.property('UserId', 1);
		})
		it('should return an error if the conversation does not exist', async () => {
			try {
				await conversationController.get(1, 10);

				expect(true).to.be.false;
			} catch (e) {
				e.errors.should.contain.something.with.property('message', 'Either the conversation doesn\'t exist or you\'re not part of the conversation');
			}
		});
		it('should return an error if the user is not part of the conversation', async () => {
			try {
				await conversationController.get(3, 1);

				expect(true).to.be.false;
			} catch (e) {
				e.errors.should.contain.something.with.property('message', 'Either the conversation doesn\'t exist or you\'re not part of the conversation');
			}
		});
	});

	describe('getFromUser search', () => {
		let firstId;
		before(async () => {
			firstId = ( await conversationController.create([2, 3]) ).id;
			await conversationController.create([2, 3, 4]);
			await conversationController.create([2, 4]);

			let messages = [];
			for(let i = firstId; i < firstId+3; i++) {
				messages.push(
					await messageController.create({
						userId: 2,
						conversationId: i,
						content: 'search ' + i
					})
				);
			}
		});

		it('should return an array of conversations matching the user id and a set of usernames', async () => {
			let conversations = await conversationController.getFromUser(2, 0, 'user_three');

			//2 not three, because it only gets conversations where there are messages
			conversations.Conversations.should.have.length(2);
			conversations.Conversations[0].Messages[0].should.have.property('content', 'search ' + (firstId+1) );
			conversations.Conversations[1].Messages[0].should.have.property('content', 'search ' + firstId);

			conversations.Conversations[0].should.have.property('lastRead');
		});
	})
})
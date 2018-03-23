let chai = require('chai');
let expect = chai.expect;
let should = chai.should();

let { Sequelize, sequelizeInstance, User } = require('../models');
let UserController = require('../controllers/user.js');

describe('User', () => {
	before(_ => sequelizeInstance.sync({ force: true }))

	describe('controller: createAccount', () => {
		it('should create an account', async () => {
			let userRes = await UserController.createAccount({ username: 'username', password: 'password' });

			userRes.should.have.property('username', username);
			userRes.should.have.property('id');
			userRes.should.not.have.property('hash');

			let user = await User.findOne({ where: { username: 'username' } });
			user.should.have.property('username', 'username');
			user.should.have.property('hash');
		});

		it('should return an error if username already exists', async () => {
			try {
				await UserController.createAccount({ username: 'username', password: 'password' });
			} catch (e) {
				expect(e instanceof Sequelize.ValidationError).to.be.true;
				e.get('username').message.should.equal('This username is already registered - try another');
			}
		});
		it('should return an error if username is less than 6 characters', async () => {
			try {
				await UserController.createAccount({ username: '12345', password: 'password' });
			} catch (e) {
				expect(e instanceof Sequelize.ValidationError).to.be.true;
				e.get('username').message.should.equal('Username must be at least 6 characters');
			}
		});
		it('should trim blank characters', async () => {
			try {
				await UserController.createAccount({ username: ' '.repeat(6), password: 'password' });
			} catch (e) {
				expect(e instanceof Sequelize.ValidationError).to.be.true;
				e.get('username').message.should.equal('Username must be at least 6 characters');
			}
		});
		it('should return an error if username is more than 30 characters', async () => {
			try {
				await UserController.createAccount({ username: '1'.repeat(31), password: 'password' });
			} catch (e) {
				expect(e instanceof Sequelize.ValidationError).to.be.true;
				e.get('username').message.should.equal('Username can\'t be longer than 30 characters');
			}
		});
		it('should return an error if username is not a string', async () => {
			try {
				await UserController.createAccount({ username: {}, password: 'password' });
			} catch (e) {
				expect(e instanceof Sequelize.ValidationError).to.be.true;
				e.get('username').message.should.equal('Username must be a string');
			}
		});

		it('should return an error if password is less than 8 characters', async () => {
			try {
				await UserController.createAccount({ username: 'abcdefgh', password: '1234567' });
			} catch (e) {
				expect(e instanceof Sequelize.ValidationError).to.be.true;
				e.get('hash').message.should.equal('Password must be at least 8 charcters');
			}
		});
		it('should return an error if password is more than 100 characters', async () => {
			try {
				await UserController.createAccount({ username: 'abcdefgh', password: '1'.repeat(101) });
			} catch (e) {
				expect(e instanceof Sequelize.ValidationError).to.be.true;
				e.get('hash').message.should.equal('Password can\'t be longer than 100 characters');
			}
		});
		it('should return an error if password is not a string', async () => {
			try {
				await UserController.createAccount({ username: 'abcdefgh', password: {} });
			} catch (e) {
				expect(e instanceof Sequelize.ValidationError).to.be.true;
				e.get('hash').message.should.equal('Password must be a string');
			}
		});
	});

	describe('controller: login', () => {
		it('should return `true` if the username and password are correct', async () => {
			let res = await UserController.login({ username: 'username', password: 'password' });

			res.should.be.true;
		});
		it('should return an error if the password is incorrect', async () => {
			try {
				await UserController.login({ username: 'username', password: 'wrong_password' });
			} catch (e) {
				expect(e instanceof Sequelize.ValidationError).to.be.true;
				e.get('hash').message.should.equal('Password is incorrect');
			}
		});
		it('should return an error if the username does not exist', async () => {
			try {
				await UserController.login({ username: 'wrong_username', password: 'password' });
			} catch (e) {
				expect(e instanceof Sequelize.ValidationError).to.be.true;
				e.get('hash').message.should.equal('Username is incorrect');
			}
		});
	})
})
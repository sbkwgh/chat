let chai = require('chai');
	let expect = chai.expect;
	let should = chai.should();
let chaiThings = require('chai-things');
chai.use(chaiThings);

let models = require('../models');
	let { Sequelize, User } = models;
	let sequelizeInstance = models.sequelize;
let userController = require('../controllers/user.js');


describe('User', () => {
	before(done => {
		sequelizeInstance
			.sync({ force: true })
			.then(() => done())
			.catch(done);
	})

	after(() => {
		sequelizeInstance.close();
	})

	describe('controller: createAccount', () => {
		it('should create an account', async () => {
			let userRes = await userController.createAccount('username', 'password');

			userRes.should.have.property('username', 'username');
			userRes.should.have.property('id');
			userRes.should.have.property('hash');

			let user = await User.findOne({ where: { username: 'username' } });
			user.should.have.property('username', 'username');
			user.should.have.property('hash');
		});

		it('should return an error if username already exists', async () => {
			try {
				await userController.createAccount('username', 'password');
			} catch (e) {
				expect(e instanceof Sequelize.ValidationError).to.be.true;
				e.errors.should.contain.something.with.property('message', 'This username is already registered - try another');
			}
		});
		it('should return an error if username is less than 6 characters', async () => {
			try {
				await userController.createAccount('12345', 'password');
			} catch (e) {
				expect(e instanceof Sequelize.ValidationError).to.be.true;
				e.errors.should.contain.something.with.property('message', 'Username must be at least 6 characters');
			}
		});
		it('should trim blank characters', async () => {
			try {
				await userController.createAccount(' '.repeat(6), 'password' );
			} catch (e) {
				expect(e instanceof Sequelize.ValidationError).to.be.true;
				e.errors.should.contain.something.with.property('message', 'Username must be at least 6 characters');
			}
		});
		it('should return an error if username is more than 30 characters', async () => {
			try {
				await userController.createAccount('1'.repeat(31), 'password');
			} catch (e) {
				expect(e instanceof Sequelize.ValidationError).to.be.true;
				e.errors.should.contain.something.with.property('message', 'Username can\'t be longer than 30 characters');
			}
		});
		it('should return an error if username contains blank characters', async () => {
			try {
				await userController.createAccount('username with spaces', 'password');
			} catch (e) {
				expect(e instanceof Sequelize.ValidationError).to.be.true;
				e.errors.should.contain.something.with.property('message', 'Username can\'t contain blank characters');
			}
		});
		it('should return an error if username is not a string', async () => {
			try {
				await userController.createAccount({}, 'password');
			} catch (e) {
				expect(e instanceof Sequelize.ValidationError).to.be.true;
				e.errors.should.contain.something.with.property('message', 'Username must be a string');
			}
		});

		it('should return an error if password is less than 8 characters', async () => {
			try {
				await userController.createAccount('abcdefgh', '1234567');
			} catch (e) {
				expect(e instanceof Sequelize.ValidationError).to.be.true;
				e.errors.should.contain.something.with.property('message', 'Password must be at least 8 charcters');
			}
		});
		it('should return an error if password is more than 100 characters', async () => {
			try {
				await userController.createAccount('abcdefgh', '1'.repeat(101));
			} catch (e) {
				expect(e instanceof Sequelize.ValidationError).to.be.true;
				e.errors.should.contain.something.with.property('message', 'Password can\'t be longer than 100 characters');
			}
		});
		it('should return an error if password is not a string', async () => {
			try {
				await userController.createAccount('abcdefgh', {});
			} catch (e) {
				expect(e instanceof Sequelize.ValidationError).to.be.true;
				e.errors.should.contain.something.with.property('message', 'Password must be a string');
			}
		});
	});

	describe('controller: login', () => {
		it('should return `true` if the username and password are correct', async () => {
			let res = await userController.login('username', 'password');

			res.should.be.true;
		});
		it('should return an error if the password is incorrect', async () => {
			try {
				await userController.login('username', 'wrong_password');
			} catch (e) {
				expect(e instanceof Sequelize.ValidationError).to.be.true;
				e.errors.should.contain.something.with.property('message', 'Password is incorrect');
			}
		});
		it('should return an error if the username does not exist', async () => {
			try {
				await userController.login('wrong_username', 'password');
			} catch (e) {
				expect(e instanceof Sequelize.ValidationError).to.be.true;
				e.errors.should.contain.something.with.property('message', 'Username is incorrect');
			}
		});
	})
})
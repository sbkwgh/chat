let chai = require('chai');
	let expect = chai.expect;
	let should = chai.should();
let chaiThings = require('chai-things');
chai.use(chaiThings);

let models = require('../models');
	let { Sequelize, User } = models;
	let sequelizeInstance = models.sequelize;
let userController = require('../controllers/user.js');


describe('User controller', () => {
	after(done => {
		sequelizeInstance
			.sync({ force: true })
			.then(() => done())
			.catch(done);
	})

	describe('controller: create', () => {
		it('should create an account', async () => {
			let userRes = await userController.create('username', 'password');

			userRes.should.have.property('username', 'username');
			userRes.should.have.property('id');
			userRes.should.not.have.property('hash');

			let user = await User.findOne({ where: { username: 'username' } });
			user.should.have.property('username', 'username');
			user.should.have.property('hash');
		});

		it('should return an error if username already exists', async () => {
			try {
				await userController.create('username', 'password');
			} catch (e) {
				expect(e instanceof Sequelize.ValidationError).to.be.true;
				e.errors.should.contain.something.with.property('message', 'This username is already registered - try another');
			}
		});
		it('should return an error if username is less than 6 characters', async () => {
			try {
				await userController.create('12345', 'password');
			} catch (e) {
				expect(e instanceof Sequelize.ValidationError).to.be.true;
				e.errors.should.contain.something.with.property('message', 'Username must be at least 6 characters');
			}
		});
		it('should trim blank characters', async () => {
			try {
				await userController.create(' '.repeat(6), 'password' );
			} catch (e) {
				expect(e instanceof Sequelize.ValidationError).to.be.true;
				e.errors.should.contain.something.with.property('message', 'Username must be at least 6 characters');
			}
		});
		it('should return an error if username is more than 30 characters', async () => {
			try {
				await userController.create('1'.repeat(31), 'password');
			} catch (e) {
				expect(e instanceof Sequelize.ValidationError).to.be.true;
				e.errors.should.contain.something.with.property('message', 'Username can\'t be longer than 30 characters');
			}
		});
		it('should return an error if username contains blank characters', async () => {
			try {
				await userController.create('username with spaces', 'password');
			} catch (e) {
				expect(e instanceof Sequelize.ValidationError).to.be.true;
				e.errors.should.contain.something.with.property('message', 'Username can\'t contain blank characters');
			}
		});
		it('should return an error if username is not a string', async () => {
			try {
				await userController.create({}, 'password');
			} catch (e) {
				expect(e instanceof Sequelize.ValidationError).to.be.true;
				e.errors.should.contain.something.with.property('message', 'Username must be a string');
			}
		});

		it('should return an error if password is less than 8 characters', async () => {
			try {
				await userController.create('abcdefgh', '1234567');
			} catch (e) {
				expect(e instanceof Sequelize.ValidationError).to.be.true;
				e.errors.should.contain.something.with.property('message', 'Password must be at least 8 charcters');
			}
		});
		it('should return an error if password is more than 100 characters', async () => {
			try {
				await userController.create('abcdefgh', '1'.repeat(101));
			} catch (e) {
				expect(e instanceof Sequelize.ValidationError).to.be.true;
				e.errors.should.contain.something.with.property('message', 'Password can\'t be longer than 100 characters');
			}
		});
		it('should return an error if password is not a string', async () => {
			try {
				await userController.create('abcdefgh', {});
			} catch (e) {
				expect(e instanceof Sequelize.ValidationError).to.be.true;
				e.errors.should.contain.something.with.property('message', 'Password must be a string');
			}
		});
	});

	describe('controller: login', () => {
		it('should return the user if the username and password are correct', async () => {
			let res = await userController.login('username', 'password');

			res.should.have.property('username', 'username');
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

	describe('controller: get', () => {
		it('should get an account via the id', async () => {
			let res = await userController.get(1);
			
			res.should.have.property('username', 'username');
			res.should.not.have.property('hash');
		});
		it('should get an account via the username', async () => {
			let res = await userController.get('username');

			res.should.have.property('username', 'username');
			res.should.not.have.property('hash');
		});
		it('should return an error if the username does not exist', async () => {
			try {
				let res = await userController.get(3);
			} catch (e) {
				(e instanceof Sequelize.ValidationError).should.be.true;
				e.errors.should.contain.something.with.property('message', 'User does not exist');
			}
		});
		it('should return an error if parameter is not a string or number', async () => {
			try {
				let res = await userController.get(null);
			} catch (e) {
				(e instanceof Sequelize.ValidationError).should.be.true;
				e.errors.should.contain.something.with.property('message', 'Parameter must be a string or number');
			}
		});
	})

	describe('controller: getAllBeginningWith', () => {
		before(async () => {
			await userController.create('john_abc', 'password');
			await userController.create('john_abd', 'password');
			await userController.create('john_z', 'password');
		})

		it('should get a list of users beginning with the string', async () => {
			let users = await userController.getAllBeginningWith('john');

			users.length.should.equal(3);

			users[0].username.should.equal('john_z');
			users[1].username.should.equal('john_abc');
			users[2].username.should.equal('john_abd');
		});
		it('should get return an empty string if no users exist', async () => {
			let users = await userController.getAllBeginningWith('123456yuhjnbvcxsawe456');
			users.length.should.equal(0);
		});
		it('should return an error if no string provided', async () => {
			try {
				let users = await userController.getAllBeginningWith([]);

				expect(true).to.be.false;
			} catch (e) {
				e.errors.should.contain.something.with.property('message', 'Username must be a string');
			}
		});
	})
})
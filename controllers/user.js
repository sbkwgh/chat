let validationError = require('../lib/validationError.js');
let { User, sequelize } = require('../models');
let bcrypt = require('bcrypt');

exports.create = async function (username, password) {
	let user = await User.create({ username, hash: password });
	let userJson = user.toJSON();
	delete userJson.hash;

	return userJson;
};

exports.get = async function () {
	let arg = arguments[0]
	let where = {};

	if(typeof arg === 'string') {
		where.username = arg;
	} else if(typeof arg === 'number') {
		where.id = arg;
	} else {
		throw new validationError(sequelize, {
			message: 'Parameter must be a string or number',
			value: arg
		});
	}

	let user = await User.findOne({
		attributes: { exclude: ['hash'] },
		where
	});

	if(user) {
		return user.toJSON();
	} else {
		return validationError(sequelize, {
			message: 'User does not exist',
			path: 'id',
			value: id
		});
	}
}

exports.login = async function (username, password) {
	let user = await User.findOne({ 
		where: { username }
	});

	if(!user) {
		throw validationError(sequelize, {
			message: 'Username is incorrect',
			path: 'username',
			value: username
		});
	} else {
		let res = await bcrypt.compare(password, user.hash);

		if(res) {
			delete user.hash;
			return user.toJSON();
		} else {
			throw validationError(sequelize, {
				message: 'Password is incorrect',
				path: 'hash',
				value: password
			});
		}
	}
};
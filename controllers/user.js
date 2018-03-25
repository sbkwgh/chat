let validationError = require('../lib/validationError.js');
let { User, sequelize } = require('../models');
let bcrypt = require('bcrypt');

exports.create = async function (username, password) {
	let user = await User.create({ username, hash: password });
	let userJson = user.toJSON();
	delete userJson.hash;

	return userJson;
};

exports.get = async function (id) {
	let user = await User.findById(id, {
		attributes: { exclude: ['hash'] }
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
	let user = await User.findOne({ where: { username } });

	if(!user) {
		throw validationError(sequelize, {
			message: 'Username is incorrect',
			path: 'username',
			value: username
		});
	} else {
		let res = await bcrypt.compare(password, user.hash);

		if(res) {
			return true;
		} else {
			throw validationError(sequelize, {
				message: 'Password is incorrect',
				path: 'hash',
				value: password
			});
		}
	}
};
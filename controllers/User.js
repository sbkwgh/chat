let validationError = require('../lib/validationError.js');
let { User, sequelize } = require('../models');
let bcrypt = require('bcrypt');

exports.createAccount = async function (username, password) {
	let user = await User.create({ username, hash: password });

	return user;
};

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
let validationError = require('../lib/errors/validationError.js');
let { User, sequelize } = require('../models');
let bcrypt = require('bcrypt');

exports.create = async function (username , password) {
	let user = await User.create({ username, hash: password });
	let userJson = user.toJSON();
	delete userJson.hash;

	return userJson;
};

exports.get = async function (userId) {
	let user = await User.findById(userId, {
		attributes: { exclude: ['hash'] }
	});

	if(user) {
		return user.toJSON();
	} else {
		throw validationError(sequelize, {
			message: 'User does not exist',
			value: userId
		});
	}
}

exports.getAllBeginningWith = async function (username) {
	let users = await User.findAll({
		attributes: { exclude: ['hash'] },
		where: {
			username: {
				[sequelize.Op.like]: username + '%'
			}
		},
		limit: 10
	});

	let sorted = users.sort((a, b) => {
		if(a.username.length !== b.username.length) {
			return a.username.length > b.username.length
		} else {
			return a.username.localeCompare(b.username);
		}
	});

	return sorted.map(user => user.toJSON());
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
			let userJson = user.toJSON();
			delete userJson.hash;
			return userJson;
		} else {
			throw validationError(sequelize, {
				message: 'Password is incorrect',
				path: 'hash',
				value: password
			});
		}
	}
};